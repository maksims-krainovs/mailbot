import { analyzeEmail } from "./commands.js";
import log from "./index.js";
import Imap from "node-imap";
import { validateEnv } from "./validations.js";

export const createIMAP = () => {
  const { user, password, host, port, msReconnect } = validateEnv(log)(
    process.env,
  );
  if (user && password) {
    const IMAP = new Imap({
      user,
      password,
      host,
      port: Number(port),
      debug: (x) => log.debug(x),
      tls: true,
    });
    return {
      IMAP,
      msReconnect,
    };
  }
};

export const onSearchUnseen = (imap: Imap) => (err: Error, uids: number[]) => {
  log.info(uids, "uids");
  if (err) {
    log.error(err);
    return;
  }
  uids.forEach((uid) => {
    log.info("getting " + uid);
    const fetchResult = imap.fetch(uid, {
      bodies: ["HEADER.FIELDS (FROM SUBJECT DATE)", "TEXT"],
    });
    fetchResult.on("message", (msg, seqno) => {
      log.info("seqno: " + seqno);
      let buffer = "";
      let body = "";
      msg.once("body", (stream, info) => {
        log.info("body event");
        stream.once("data", (chunk: unknown) => {
          log.debug("data chunk", chunk);
          const strChunk = chunk?.toString();
          buffer += strChunk;
          if (info.which === "TEXT") {
            body += strChunk;
          }
        });
        stream.once("end", () => {
          log.info("end event");
          const parsed = Imap.parseHeader(buffer);
          const fetchedMsg = {
            from: parsed.from[0],
            subj: parsed.subject[0],
            body,
          };
          log.info(fetchedMsg, "fetchedMsg");
          analyzeEmail()(fetchedMsg);
        });
      });
    });
  });
};
