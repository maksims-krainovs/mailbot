import { log } from "./log.js";

export const validateEnv = (env: NodeJS.ProcessEnv) => {
  const { user, password, host, port, reconnect } = env;
  const msReconnect = Number(reconnect);
  const errors = [];
  if (!user) {
    errors.push("Missing user");
  }
  if (!password) {
    errors.push("Missing password");
  }
  if (!host) {
    errors.push("Missing host");
  }
  if (!port) {
    errors.push("Missing port");
  }
  if (isNaN(msReconnect) || msReconnect < 1000) {
    errors.push("Reconnection interval less than 1s");
  }
  if (errors.length > 0) {
    log.error("ERROR: Wrong .env parameters: " + errors.join("; "));
    return { error: errors.join("; ") };
  }
  if (user && password) {
    return { user, password, host, port, msReconnect };
  }
  return {};
};
