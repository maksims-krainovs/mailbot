export const validateEnv = () => {
  const { user, password, host, port, reconnect } = process.env;
  const msReconnect = Number(reconnect);
  let error = "";
  if (!user) {
    error += "Missing user; ";
  }
  if (!password) {
    error += "Missing password; ";
  }
  if (!host) {
    error += "Missing host; ";
  }
  if (!port) {
    error += "Missing port; ";
  }
  if (msReconnect < 1000) {
    error += "Reconnection interval less than 1s; ";
  }
  if (error) {
    console.error("ERROR: Wrong .env parameters: " + error);
    return { error };
  }
  if (user && password) {
    return { user, password, host, port, msReconnect };
  }
  return {};
};
