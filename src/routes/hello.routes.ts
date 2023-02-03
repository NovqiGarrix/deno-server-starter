import { Router } from '@deps';
import { hello } from '@controllers/hello.controller.ts';

const router = new Router();

router.get("/", hello);

export default router.routes();