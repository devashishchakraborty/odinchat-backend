import { Router } from "express";
import messageController from "../controllers/messageController.js";

const messageRouter = Router();

messageRouter.get("/", messageController.getMessages);
messageRouter.post("/", messageController.createMessage);
messageRouter.delete("/:messageId", messageController.deleteMessage);

export default messageRouter;
