import { Router } from "express";
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { sendMessageValidator } from "../validator/sendMessage.validator.js";

const router = Router();

router.use(verifyjwt);

router
  .route("/:chatId")
  .get( getAllMessages)
  .post(
    upload.fields([{ name: "attachments", maxCount: 5 }]),
    
    sendMessageValidator(),
  
    sendMessage
  );

//Delete message route based on Message id

router
  .route("/:chatId/:messageId")
  .delete(
    deleteMessage
  );

export default router;
