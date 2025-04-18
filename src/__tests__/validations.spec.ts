import { describe, expect, it } from "vitest";
import { validateEnv } from "../validations.js";

const env = {
  user: "test",
  password: "test",
  host: "test",
  port: "993",
  reconnect: "10000",
};

describe("ENV validation", () => {
  it("should return parameters if .env is valid", () => {
    const validateEnvResult = validateEnv(env);
    expect(validateEnvResult.user).toBeTruthy();
  });
  it("should return error if .env is empty", () => {
    const validateEnvResult = validateEnv({});
    expect(validateEnvResult.error).toBe(
      "Missing user; Missing password; Missing host; Missing port; Reconnection interval less than 1s",
    );
  });
  it("should return error if .env is invalid", () => {
    const validateEnvResult = validateEnv({ ...env, user: "" });
    expect(validateEnvResult.error).toBe("Missing user");
  });
  it("should return error if .env.RECONNECT is wrong", () => {
    const validateEnvResult = validateEnv({ ...env, reconnect: "999" });
    expect(validateEnvResult.error).toBe("Reconnection interval less than 1s");
  });
});
