import { Router } from "@deps";
import { uploadFileHandler } from "@controllers/files.controller.ts";

const router = new Router();

router.post("/", uploadFileHandler);

export default router.routes();