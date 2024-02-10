import { Router } from "@deps";
import { uploadUserFormFileHandler } from "@controllers/users.controller.ts";

const router = new Router();

router.post("/full_form", uploadUserFormFileHandler);

export default router.routes();