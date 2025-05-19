import prisma from "@/lib/prisma";
import { z, createRoute } from "@hono/zod-openapi";
import type { OpenAPIHono } from "@hono/zod-openapi";

const MessagesResponseSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});

export default function registerGetMessages(router: OpenAPIHono) {
  const route = createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: MessagesResponseSchema,
          },
        },
        description: "Success",
      },
    },
    summary: `Get messages`,
    tags: ["Messages"],
  });

  router.openapi(route, async (ctx) => {
    const messages = await prisma.message.findMany();

    return ctx.json({ messages }, 200);
  });
}
