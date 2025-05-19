import { OpenAPIHono } from "@hono/zod-openapi";
import messageRouter from "@/modules/message/router";

const router = new OpenAPIHono();
router.route("/messages", messageRouter);

export default router;
