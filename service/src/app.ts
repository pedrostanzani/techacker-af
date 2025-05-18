import { ZodError } from "zod";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

import router from "@/router";
import { UnauthorizedError, BadRequestError, WeakPasswordError } from "@/errors";

const app = new OpenAPIHono();
app.route("/", router);

// The OpenAPI documentation will be available at /spec
app.doc("/spec", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Hono Starter Kit",
  },
  tags: [
    {
      name: "Hello, world!",
    },
  ],
});

app.get("/", Scalar({ url: "/spec" }));

app.onError((err, c) => {
  if (err instanceof ZodError) {
    return c.json(
      {
        code: 400,
        errorCode: "VALIDATION_ERROR",
        message: "Validation Error",
        errors: [],
      },
      400,
    );
  }

  if (err instanceof BadRequestError || err instanceof WeakPasswordError || err instanceof UnauthorizedError) {
    return c.json(err.getEnvelope(), err.statusCode);
  }

  console.error(err);
  return c.json(
    {
      code: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    },
    500,
  );
});

export { app };
