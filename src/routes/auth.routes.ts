import { Router } from "@deps";
import { signinHandler, signupHandler, getGithubOAuthTokenHandler, getGithubOAuthUrlHandler, verifyEmailOtpHandler, getMeHandler } from "@controllers/auth.controller.ts";
import authMiddleware from "@middlewares/auth.middleware.ts";

const router = new Router();

router.post("/", signinHandler);

router.get("/github/url", getGithubOAuthUrlHandler);
router.get("/github/callback", getGithubOAuthTokenHandler);

router.post("/signup", signupHandler);
router.post("/signup/verify", verifyEmailOtpHandler);

router.get("/me", authMiddleware, getMeHandler);

export default router.routes();
