import { describe, expect, it } from "vitest";
import { validateEnv } from "../validations.js";
import pino from "pino";

const log = pino.pino({
  level: "info",
  transport: {
    target: "pino-pretty",
  },
});

const env = {
  user: "test",
  password: "test",
  host: "test",
  port: "993",
  reconnect: "10000",
};

describe("ENV validation", () => {
  const validate = validateEnv(log);
  it("should return parameters if .env is valid", () => {
    const validateEnvResult = validate(env);
    expect(validateEnvResult.user).toBeTruthy();
  });
  it("should return error if .env is empty", () => {
    const validateEnvResult = validate({});
    expect(validateEnvResult.error).toBe(
      "Missing user; Missing password; Missing host; Missing port; Reconnection interval less than 1s",
    );
  });
  it("should return error if .env is invalid", () => {
    const validateEnvResult = validate({ ...env, user: "" });
    expect(validateEnvResult.error).toBe("Missing user");
  });
  it("should return error if .env.RECONNECT is wrong", () => {
    const validateEnvResult = validate({ ...env, reconnect: "999" });
    expect(validateEnvResult.error).toBe("Reconnection interval less than 1s");
  });
});
