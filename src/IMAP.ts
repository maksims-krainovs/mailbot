import { validateEnv } from "./validations.js";
import Imap from "node-imap";

export const createIMAP = () => {
  const { user, password, host, port, msReconnect } = validateEnv(process.env);
  if (user && password) {
    const IMAP = new Imap({
      user,
      password,
      host,
      port: Number(port),
      debug: (x) => console.log(x),
      tls: true,
    });
    return {
      IMAP,
      msReconnect,
    };
  }
};
