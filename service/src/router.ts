import { OpenAPIHono } from "@hono/zod-openapi";
import helloRouter from "@/modules/hello/router";

const router = new OpenAPIHono();
router.route("/hello", helloRouter);

export default router;
