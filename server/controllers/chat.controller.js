import { asyncHandler } from "../utilities/asyncHandler.js";
import ApiResponse from "../utilities/ApiResponse.js";
import ApiError from "../utilities/ApiError.js";
import { Chat } from "../module/chat.model.js";
import { User } from "../module/user.model.js";
import mongoose from "mongoose";
import { emitSocketEvent } from "../socket/index.js";
import { ChatEventEnum } from "../src/constant.js";

const chatCommonAggregation = () => [
  {
    $lookup: {
      from: "users",
      localField: "participants",
      foreignField: "_id",
      as: "participants",
      pipeline: [
        {
          $project: {
            password: 0,
            refreshToken: 0,
            forgotPasswordToken: 0,
            forgotPasswordExpiry: 0,
            emailVerificationToken: 0,
            emailVerificationExpiry: 0,
          },
        },
      ],
    },
  },
  {
    $lookup: {
      from: "messages",
      localField: "lastMessage",
      foreignField: "_id",
      as: "lastMessage",
      pipeline: [
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
      ],
    },
  },
  {
    $addFields: {
      lastMessage: { $first: "$lastMessage" },
    },
  },
];

const deleteCascadeChatMessages = async (chatId) => {
  const messages = await ChatMessage.find({
    chat: new mongoose.Types.ObjectId(chatId),
  });

  let attachments = [];

  attachments = attachments.concat(
    ...messages.map((message) => message.attachments)
  );

  attachments.forEach((attachment) => {
    removeLocalFile(attachment.localPath);
  });

  await ChatMessage.deleteMany({
    chat: new mongoose.Types.ObjectId(chatId),
  });
};

const addNewParticipantInGroupChat = asyncHandler(async (req, res) => {
  const { chatId, participantId } = req.params;

  const groupChat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(chatId),
    isGroupChat: true,
  });

  if (!groupChat) {
    throw new ApiError(404, "Chat not found");
  }

  if (groupChat.admin.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to add");
  }

  if (groupChat.participants.includes(participantId)) {
    throw new ApiError(400, "User is already a participant");
  }

  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        participants: participantId,
      },
    },
    { new: true }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = chat[0];

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Participant added successfully"));
});

const leaveGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const groupChat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(chatId),
    isGroupChat: true,
  });

  if (!groupChat) {
    throw new ApiError(404, "Chat not found");
  }

  if (!groupChat.participants.includes(req.user._id)) {
    throw new ApiError(400, "User is not a participant");
  }

  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        participants: req.user._id,
      },
    },
    { new: true }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: updatedGroup._id,
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(404, "Chat not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Left the group successfully"));
});

const getGroupChatDetails = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const groupChat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(chatId),
    isGroupChat: true,
  });

  if (!groupChat) {
    throw new ApiError(404, "Chat not found");
  }

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true,
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(404, "Chat not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Chat details fetched successfully"));
});

const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.aggregate([
    {
      $match: {
        participants: req.user._id,
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    ...chatCommonAggregation(),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, chats || [], "Chats fetched successfully"));
});

const deleteOneOnOneChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: false,
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(404, "Chat not found");
  }

  await Chat.findByIdAndDelete(chatId);
  await deleteCascadeChatMessages(chatId);

  const otherParticipants = payload.participants.find(
    (participant) => participant._id.toString() !== req.user._id.toString()
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Chat deleted successfully"));
});

const deleteGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const groupChat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true,
      },
    },
    ...chatCommonAggregation(),
  ]);

  const chat = groupChat[0];

  if (!chat) {
    throw new ApiError(404, "Chat not present");
  }

  if (chat.admin.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not the admin");
  }

  await Chat.findByIdAndDelete(chatId);
  await deleteCascadeChatMessages(chatId);

  chat.participants.forEach((participant) => {
    if (participant._id.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      participant._id.toString(),
      ChatEventEnum.LEAVE_CHAT_EVENT,
      chat
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Group chat deleted successfully"));
});

const createOrGetAOneOnOneChat = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  
  console.log("receiverId", receiverId);
  console.log("users", req.user); // Assuming req.user contains the authenticated user's info

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).send({ error: 'Invalid receiver ID format' });
  }

  const user = await User.findById(receiverId);

  if (!user) {
    throw new ApiError(404, "No user found");
  }

  if (receiverId.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot chat with yourself");
  }

  const chat = await Chat.aggregate([
    {
      $match: {
        isGroupChat: false,
        participants: {
          $all: [
            new mongoose.Types.ObjectId(req.user._id),
            new mongoose.Types.ObjectId(receiverId),
          ],
        },
      },
    },
    ...chatCommonAggregation(),
  ]);

  if (chat.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, chat[0], "Chat retrieved successfully"));
  }

  const newChatInstance = await Chat.create({
    name: "One on one chat",
    participants: [new mongoose.Types.ObjectId(req.user._id),new mongoose.Types.ObjectId(receiverId)],
    admin: req.user._id,
  });

  const createdChat = await Chat.aggregate([
    {
      $match: {
        _id: newChatInstance._id,
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = createdChat[0];

  if (!payload) {
    throw new ApiError(500, "Internal server error");
  }

  payload.participants.forEach((participant) => {
    if (participant._id.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      participant._id.toString(),
      ChatEventEnum.CREATE_CHAT_EVENT,
      payload
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Chat created successfully"));
});


const createAGroupChat = asyncHandler(async (req, res) => {
  const { name, participants } = req.body;

  const chatParticipants = [
    ...participants.map((participant) => new mongoose.Types.ObjectId(participant)),
    req.user._id,
  ];

  const newChatInstance = await Chat.create({
    name,
    participants: chatParticipants,
    isGroupChat: true,
    admin: req.user._id,
  });

  const createdChat = await Chat.aggregate([
    {
      $match: {
        _id: newChatInstance._id,
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = createdChat[0];

  if (!payload) {
    throw new ApiError(500, "Internal server error");
  }

  payload.participants.forEach((participant) => {
    if (participant._id.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      participant._id.toString(),
      ChatEventEnum.CREATE_CHAT_EVENT,
      payload
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Group chat created successfully"));
});

const removeParticipantFromGroupChat = asyncHandler(async (req, res) => {
  const { chatId, participantId } = req.params;

  const groupChat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(chatId),
    isGroupChat: true,
  });

  if (!groupChat) {
    throw new ApiError(404, "Chat not found");
  }

  if (groupChat.admin.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to remove");
  }

  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        participants: new mongoose.Types.ObjectId(participantId),
      },
    },
    { new: true }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(404, "Chat not found");
  }

  emitSocketEvent(
    req,
    participantId,
    ChatEventEnum.LEAVE_CHAT_EVENT,
    payload
  );

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Participant removed successfully"));
});

const searchAvailableUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        _id: {
          $ne: req.user._id, // avoid logged in user
        },
      },
    },
    {
      $project: {
        avatar: 1,
        username: 1,
        email: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { name } = req.body;

  // check for chat existence
  const groupChat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(chatId),
    isGroupChat: true,
  });

  if (!groupChat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  // only admin can change the name
  if (groupChat.admin?.toString() !== req.user._id?.toString()) {
    throw new ApiError(404, "You are not an admin");
  }

  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        name,
      },
    },
    { new: true }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: updatedGroupChat._id,
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(500, "Internal server error");
  }

  // logic to emit socket event about the updated chat name to the participants
  payload?.participants?.forEach((participant) => {
    // emit event to all the participants with updated chat as a payload
    emitSocketEvent(
      req,
      participant._id?.toString(),
      ChatEventEnum.UPDATE_GROUP_NAME_EVENT,
      payload
    );
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, chat[0], "Group chat name updated successfully")
    );
});

export {
  addNewParticipantInGroupChat,
  leaveGroupChat,
  getGroupChatDetails,
  getAllChats,
  deleteOneOnOneChat,
  deleteGroupChat,
  createOrGetAOneOnOneChat,
  createAGroupChat,
  removeParticipantFromGroupChat,
  searchAvailableUsers,
  renameGroupChat
};
