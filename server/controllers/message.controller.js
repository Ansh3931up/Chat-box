import { asyncHandler } from "../utilities/asyncHandler.js";
import ApiError from "../utilities/ApiError.js";
import ApiResponse from "../utilities/ApiResponse.js";
// import { User } from "../module/user.model";
import { Chat } from "../module/chat.model.js";
import { Message } from "../module/message.model.js";
import mongoose from "mongoose";
import { emitSocketEvent } from "../socket/index.js";

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

  const chat = await Chat.findById({
    _id: new mongoose.Types.ObjectId(chatId),
    participants: req.user._id,
  });
  
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
  
  if (message.attachments.length > 0) {
    message.attachments.forEach((attachment) => {
      removeLocalFile(attachment); // Ensure removeLocalFile function is defined elsewhere
    });
  }
  
  await Message.deleteOne({
    _id: new mongoose.Types.ObjectId(messageId),
  });
  
  if (chat.lastMessage.toString() === message._id.toString()) {
    const lastMessage = await Message.findOne(
      { chat: chatId },
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
      req,//req parameter
      participantObjectId.toString(),//roomId parameter
      ChatEventEnum.MESSAGE_DELETE_EVENT,//event parameter
      message//payload parameter
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message deleted successfully"));
});

// Send a new message in a chat
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;
  
  if (!content && !req.files?.attachments?.length) {
    throw new ApiError(400, "Message content or attachment is required");
  }

  const selectedChat = await Chat.findById(chatId);

  if (!selectedChat) {
    throw new ApiError(404, "Chat does not exist");
  }

  const messageFiles = [];

  if (req.files && req.files.attachments?.length > 0) {
    req.files.attachments.forEach((attachment) => {
      messageFiles.push({
        url: getStaticFilePath(req, attachment.filename), // Ensure getStaticFilePath function is defined elsewhere
        localPath: getLocalPath(attachment.filename), // Ensure getLocalPath function is defined elsewhere
      });
    });
  }

  const message = await Message.create({
    sender: new mongoose.Types.ObjectId(req.user._id),
    content: content || "",
    chat: new mongoose.Types.ObjectId(chatId),
    attachments: messageFiles,
  });

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        lastMessage: message._id,
      },
    },
    { new: true }
  );

  const messages = await Message.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(message._id),
      },
    },
    ...chatMessageCommonAggregation(),
  ]);

  const receivedMessage = messages[0];

  if (!receivedMessage) {
    throw new ApiError(500, "Internal server error");
  }

  chat.participants.forEach((participantObjectId) => {
    if (participantObjectId.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      participantObjectId.toString(),
      ChatEventEnum.MESSAGE_RECEIVED_EVENT,
      receivedMessage
    );
  });

  return res
    .status(201)
    .json(new ApiResponse(201, receivedMessage, "Message saved successfully"));
});

export {
  deleteMessage,
  getAllMessages,
  sendMessage,
};
