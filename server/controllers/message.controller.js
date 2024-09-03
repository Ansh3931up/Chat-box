import { asyncHandler } from "../utilities/asyncHandler.js";
import ApiError from "../utilities/ApiError.js";
import ApiResponse from "../utilities/ApiResponse.js";
import path from 'path';
import { fileURLToPath } from 'url';
// import { User } from "../module/user.model";
import { Chat } from "../module/chat.model.js";
import { Message } from "../module/message.model.js";
import mongoose from "mongoose";
import { emitSocketEvent } from "../socket/index.js";
import { ChatEventEnum } from "../src/constant.js";
import cloudinary from "../utilities/cloudinary.js";
import { getStaticFilePath, getLocalPath } from "../utilities/filesPath.js";
// Common aggregation pipeline for chat messages
const chatMessageCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        sender: { $first: "$sender" },
      },
    },
  ];
};

// Get all messages for a specific chat
const getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ApiError(404, "Chat not exists");
  }
  if (!chat?.participants?.includes(req.user._id)) {
    throw new ApiError(404, "You are not in the group");
  }

  const messages = await Message.aggregate([
    {
      $match: {
        chat: new mongoose.Types.ObjectId(chatId),
      },
    },
    ...chatMessageCommonAggregation(),
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, messages || [], "Successfully fetched all messages"));
});

// Delete a specific message
const deleteMessage = asyncHandler(async (req, res) => {
  const { chatId, messageId } = req.params;

  // Validate chat and message IDs
  if (!mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(messageId)) {
    throw new ApiError(400, "Invalid chat or message ID");
  }

  const chat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(chatId),
    participants: req.user._id,
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found or you are not a participant");
  }

  const message = await Message.findOne({
    _id: new mongoose.Types.ObjectId(messageId),
    chat: new mongoose.Types.ObjectId(chatId),
  });

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this message");
  }

  // Remove attachments if any
  if (message.attachments && message.attachments.length > 0) {
    message.attachments.forEach((attachment) => {
      removeLocalFile(attachment); // Ensure removeLocalFile function is defined elsewhere
    });
  }

  await Message.deleteOne({ _id: new mongoose.Types.ObjectId(messageId) });

  if (chat.lastMessage && chat.lastMessage.toString() === message._id.toString()) {
    const lastMessage = await Message.findOne(
      { chat: new mongoose.Types.ObjectId(chatId) },
      {},
      { sort: { createdAt: -1 } }
    );

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: lastMessage ? lastMessage._id : null,
    });
  }

  chat.participants.forEach((participantObjectId) => {
    if (participantObjectId.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req, // req parameter
      participantObjectId.toString(), // roomId parameter
      ChatEventEnum.MESSAGE_DELETE_EVENT, // event parameter
      message // payload parameter
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message deleted successfully"));
});


// Send a new message in a chat
// Define the base URL for serving static files (adjust according to your setup)
const BASE_URL = 'http://localhost:3117'; // Replace with your actual base URL

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!mongoose.isValidObjectId(chatId)) {
    throw new ApiError(400, "Invalid chat ID format");
  }

  if (!content && !req.files?.attachment?.length) {
    throw new ApiError(400, "Message content or attachment is required");
  }

  const selectedChat = await Chat.findById(chatId);
  if (!selectedChat) {
    throw new ApiError(404, "Chat does not exist");
  }

  const messageFiles = [];

  if (req.files && req.files.attachment?.length > 0) {
    for (const file of req.files.attachment) {
      try {
        // Upload each file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: 'chat_app', // Specify the folder in Cloudinary
          resource_type: 'auto',
        });

        // Add the uploaded file's URL to messageFiles
        messageFiles.push({
          url: uploadResult.secure_url, // Use the secure URL from Cloudinary
          public_id: uploadResult.public_id, // Save public_id if you need to manage files later
        });
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new ApiError(500, 'Error uploading file to Cloudinary');
      }
    }
  }

  const message = await Message.create({
    sender: new mongoose.Types.ObjectId(req.user._id),
    content: content || "",
    chat: new mongoose.Types.ObjectId(chatId),
    attachment: messageFiles,
  });

  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id }, { new: true });

  const messages = await Message.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(message._id) } },
    ...chatMessageCommonAggregation(),
  ]);

  const receivedMessage = messages[0];

  if (!receivedMessage) {
    throw new ApiError(500, "Internal server error");
  }

  // Emit socket event to all participants except the sender
  Chat?.participants?.forEach(participant => {
    if (participant.toString() !== req.user._id.toString()) {
      emitSocketEvent(req, participant.toString(), ChatEventEnum.MESSAGE_RECEIVED_EVENT, receivedMessage);
    }
  });

  return res.status(201).json(new ApiResponse(201, receivedMessage, "Message saved successfully"));
});

export {
  deleteMessage,
  getAllMessages,
  sendMessage,
};
