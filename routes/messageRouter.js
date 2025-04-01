import { Router } from "express";

const messageRouter = Router();

messageRouter.get("/", (req, res) => {
  res.send("Welcome to messages");
});

export default messageRouter;
