import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "./src/app.js";

describe("POST /users", () => {
  describe("when passed a username and password", () => {
    it("should respond with a 200 status code", async () => {
      const response = await request(app).post("/users").send({
        username: "username",
        password: "password",
      });
      expect(response.statusCode).toBe(200);
    });
  });
});
