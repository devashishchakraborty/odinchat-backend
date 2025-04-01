import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("Welcome to Users");
});

export default userRouter;
