import { Router } from "@deps";
import helloRoutes from "./hello.routes.ts";

const router = new Router();

// router.use(authMiddleware);
router.use("/v1/hello", helloRoutes);

export default router.routes();
