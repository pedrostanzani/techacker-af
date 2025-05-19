import { BadRequestError } from "@/errors";
import { z, createRoute } from "@hono/zod-openapi";
import type { OpenAPIHono } from "@hono/zod-openapi";
import prisma from "@/lib/prisma";

const MAX_MESSAGE_LENGTH = 280;

const MessageBodySchema = z.object({
  content: z.string().min(1).max(MAX_MESSAGE_LENGTH).openapi({
    example: "Hello, world!",
  }),
});

const MessageResponseSchema = z.object({
  message: z.object({
    id: z.string(),
    content: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
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
            schema: MessageBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          "application/json": {
            schema: MessageResponseSchema,
          },
        },
        description: "Success",
      },
      400: {
        content: {
          "application/json": {
            schema: BadRequestError.schema,
          },
        },
        description: "Bad Request",
      },
    },
    summary: `Post message`,
    tags: ["Messages"],
  });

  router.openapi(route, async (ctx) => {
    const valid = ctx.req.valid("json");
    const message = await prisma.message.create({
      data: {
        content: valid.content,
      },
    });

    return ctx.json(
      {
        message,
      },
      201,
    );
  });
}
