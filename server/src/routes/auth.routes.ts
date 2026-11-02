import { Router } from "express";
import { authControllers } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { loginRules, registerRules } from "../middlewares/validate.middleware";

const authRouter = Router();

authRouter.post("/register", registerRules, authControllers.register);
authRouter.post("/login", loginRules, authControllers.login);
authRouter.get("/me", authenticate, authControllers.me);

export { authRouter };
