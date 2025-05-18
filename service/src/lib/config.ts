import "dotenv/config";

export const config = {
  PORT: 3000,
  NODE_ENV: process.env.NODE_ENV ?? "development",
};
