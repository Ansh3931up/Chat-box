import { Router } from "express";
import {
  addNewParticipantInGroupChat,
  createAGroupChat,
  createOrGetAOneOnOneChat,
  deleteGroupChat,
  deleteOneOnOneChat,
  getAllChats,
  getGroupChatDetails,
  leaveGroupChat,
  removeParticipantFromGroupChat,
  renameGroupChat,
  searchAvailableUsers,
} from "../controllers/chat.controller.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
import {
  createAGroupChatValidator,
  updateGroupChatNameValidator,
} from "../validator/chat.validators.js";
// import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
// import { validate } from "../../../validators/validate.js";
const router = Router();
router.use(verifyjwt);
router.route("/").get(getAllChats);
router.route("/users").get(searchAvailableUsers);
router.route("/c/:receiverId").post(createOrGetAOneOnOneChat);
router.route("/group").post(createAGroupChatValidator(), createAGroupChat);
router.route("/group/:chatId")
  .get(getGroupChatDetails)
  .patch(
    updateGroupChatNameValidator(),
    renameGroupChat
  )
  .delete( deleteGroupChat);
router.route("/group/:chatId/:participantId")
  .post(addNewParticipantInGroupChat  )
  .delete(
    removeParticipantFromGroupChat
);
router.route("/leave/group/:chatId").delete(leaveGroupChat);
router.route("/remove/:chatId").delete(deleteOneOnOneChat);
export default router;
