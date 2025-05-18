import { describe, it, expect } from "vitest";
import { app } from "@/app";

describe("POST /hello", () => {
  it("should return 'Hello, {name}!' message", async () => {
    const res = await app.request("/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "John" }),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello, John!" });
  });
});
