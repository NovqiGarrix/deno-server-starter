import { Router } from "@deps";
import {
    authCallbackHandler,
    getAccessTokenHandler,
    getAuthUrlHandler,
} from "@controllers/auth.controller.ts";
import authMiddleware from "@middlewares/auth.middleware.ts";

const router = new Router();

router.get("/url", getAuthUrlHandler);
router.get("/callback", authCallbackHandler);
router.get("/act", authMiddleware, getAccessTokenHandler);

export default router.routes();
