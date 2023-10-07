import { Router } from "@deps";
import helloRoutes from "./hello.routes.ts";
import authRoutes from "./auth.routes.ts";

const router = new Router();

// router.use(authMiddleware);
router.use("/v1/hello", helloRoutes);
router.use("/v1/auth", authRoutes);

export default router.routes();
