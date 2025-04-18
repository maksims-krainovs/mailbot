import { vi, afterAll, describe, expect, it } from "vitest";
import { validateEnv } from "../validations.js";

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("ENV validation positive", () => {
  it("should return parameters if .env is valid", () => {
    vi.stubEnv("USER", "test");
    vi.stubEnv("PASSWORD", "test");
    vi.stubEnv("PORT", "993");
    vi.stubEnv("HOST", "test");
    vi.stubEnv("RECONNECT", "10000");
    const validateEnvResult = validateEnv();
    expect(validateEnvResult.user).toBeTruthy();
  });
  it("should return error if .env is invalid", () => {
    vi.stubEnv("USER", "");
    const validateEnvResult = validateEnv();
    expect(validateEnvResult.error).toBe("Missing user; ");
  });
  it("should return error if .env.RECONNECT is wrong", () => {
    vi.stubEnv("USER", "test");
    vi.stubEnv("RECONNECT", "");
    const validateEnvResult = validateEnv();
    expect(validateEnvResult.error).toBe(
      "Reconnection interval less than 1s; ",
    );
  });
});
