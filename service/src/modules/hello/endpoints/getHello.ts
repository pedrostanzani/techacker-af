import { z, createRoute } from "@hono/zod-openapi";
import type { OpenAPIHono } from "@hono/zod-openapi";

const HelloResponseSchema = z.object({
  message: z.string().openapi({
    example: "Hello, world!",
  }),
});

export default function registerGetHello(router: OpenAPIHono) {
  const route = createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: HelloResponseSchema,
          },
        },
        description: "Success",
      },
    },
    summary: `Get "Hello, World!"`,
    tags: ["Hello, world!"],
  });

  router.openapi(route, async (ctx) => {
    return ctx.json(
      {
        message: "Hello, World!",
      },
      200,
    );
  });
}
