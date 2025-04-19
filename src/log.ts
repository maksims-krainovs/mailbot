import pino from "pino";

export const log = pino.pino({
  level: "info",
  transport: {
    target: "pino-pretty",
  },
});
