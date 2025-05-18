import { z } from "@hono/zod-openapi";
import { type ContentfulStatusCode } from "hono/utils/http-status";

enum ErrorCode {
  // 400 range
  VALIDATION_ERROR = "VALIDATION_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  WEAK_PASSWORD = "WEAK_PASSWORD",
  UNAUTHORIZED = "UNAUTHORIZED",

  // 500 range
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

const errorCodeToStatusCode: Record<ErrorCode, ContentfulStatusCode> = {
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.WEAK_PASSWORD]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.INTERNAL_SERVER_ERROR]: 500,
};

class BaseError extends Error {
  public statusCode: ContentfulStatusCode;

  constructor(
    message: string,
    public errorCode: ErrorCode,
  ) {
    super(message);
    this.statusCode = errorCodeToStatusCode[errorCode];
  }

  getEnvelope() {
    return {
      status: this.statusCode,
      error: this.errorCode,
      message: this.message,
    };
  }
}

class ValidationError extends BaseError {
  constructor(message: string = "Validation Error") {
    super(message, ErrorCode.VALIDATION_ERROR);
  }
}

class BadRequestError extends BaseError {
  static schema = z.object({
    status: z.literal(400),
    error: z.literal(ErrorCode.BAD_REQUEST),
    message: z.string().openapi({
      example: "Bad Request",
    }),
  });

  constructor(message: string = "Bad Request") {
    super(message, ErrorCode.BAD_REQUEST);
  }
}

class WeakPasswordError extends BaseError {
  static schema = z.object({
    status: z.literal(400),
    error: z.literal(ErrorCode.WEAK_PASSWORD),
    message: z.string().openapi({
      example: "Weak Password",
    }),
  });

  constructor(message: string = "Weak Password") {
    super(message, ErrorCode.WEAK_PASSWORD);
  }
}

class UnauthorizedError extends BaseError {
  static schema = z.object({
    status: z.literal(401),
    error: z.literal(ErrorCode.UNAUTHORIZED),
    message: z.string().openapi({
      example: "Unauthorized",
    }),
  });

  constructor(message: string = "Unauthorized") {
    super(message, ErrorCode.UNAUTHORIZED);
  }
}

class InternalServerError extends BaseError {
  static schema = z.object({
    status: z.literal(500),
    error: z.literal(ErrorCode.INTERNAL_SERVER_ERROR),
    message: z.string().openapi({
      example: "Internal Server Error",
    }),
  });

  constructor(message: string = "Internal Server Error") {
    super(message, ErrorCode.INTERNAL_SERVER_ERROR);
  }
}

export { ValidationError, BadRequestError, WeakPasswordError, UnauthorizedError, InternalServerError };
