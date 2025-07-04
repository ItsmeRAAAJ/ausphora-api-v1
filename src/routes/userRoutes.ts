import { Router } from "express";
import { logout, me, session, signin, signup, verify_email } from "../controllers/userControllers";
import { UserAuth } from "../middlewares/userAuthentication";

export const UserRouter = Router();

UserRouter.post("/signup" , signup);
UserRouter.post("/signin" , signin);
UserRouter.post("/logout" , logout)
UserRouter.post("/verify-mail" , verify_email);
UserRouter.get("/me" , UserAuth , me);
UserRouter.get("/session" , UserAuth , session);