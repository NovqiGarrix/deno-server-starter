import { Router } from "@deps";
import { getAccessTokenHandler, hello } from "@controllers/hello.controller.ts";

const router = new Router();

router.get("/", hello);
router.get("/act", getAccessTokenHandler);

export default router.routes();
