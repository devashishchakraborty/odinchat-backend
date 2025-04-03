import { Router } from "express";
import profileController from "../controllers/profileController.js";

const profileRouter = Router();

profileRouter.get("/", profileController.getProfileByUserId);
profileRouter.put("/", profileController.editProfile);

export default profileRouter;
