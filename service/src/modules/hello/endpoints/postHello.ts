import { z, createRoute } from "@hono/zod-openapi";
import type { OpenAPIHono } from "@hono/zod-openapi";

const HelloBodySchema = z.object({
  name: z.string().openapi({
    example: "Pedro",
  }),
});

const HelloResponseSchema = z.object({
  message: z.string().openapi({
    example: "Hello, Pedro!",
  }),
});

export default function registerGetHello(router: OpenAPIHono) {
  const route = createRoute({
    method: "post",
    path: "/",
    request: {
      body: {
        content: {
          "application/json": {
            schema: HelloBodySchema,
          },
        },
      },
    },
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
    summary: `Post name`,
    tags: ["Hello, world!"],
  });

  router.openapi(route, async (ctx) => {
    const valid = ctx.req.valid("json");
    return ctx.json(
      {
        message: `Hello, ${valid.name}!`,
      },
      200,
    );
  });
}
