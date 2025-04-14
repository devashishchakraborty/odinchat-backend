import { Router } from "express";
import profileController from "../controllers/profileController.js";

const profileRouter = Router();

profileRouter.get("/:userId", profileController.getProfileByUserId);
profileRouter.put("/", profileController.editProfile);

export default profileRouter;
