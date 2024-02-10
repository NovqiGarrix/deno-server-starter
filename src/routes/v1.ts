import { Router } from "@deps";
import authRoutes from "./auth.routes.ts";
import filesRoutes from "./files.routes.ts";
import usersRoutes from "./users.routes.ts";
import authMiddleware from "@middlewares/auth.middleware.ts";

const router = new Router();

router.use("/v1/auth", authRoutes);
router.use("/v1/files", filesRoutes);
router.use("/v1/users", authMiddleware, usersRoutes);

export default router.routes();
