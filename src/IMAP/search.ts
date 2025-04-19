import { analyzeEmail } from "../commands.js";
import Imap from "node-imap";
import { log } from "../log.js";

export const onSearchUnseen = (imap: Imap) => (err: Error, uids: number[]) => {
  log.info(uids, "uids");
  if (err) {
    log.error(err);
    return;
  }
  uids.forEach((uid) => {
    log.info("getting " + uid);
    const fetchResult = imap.fetch(uid, {
      bodies: ["HEADER", "TEXT"],
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
          log.info(parsed, "parsed");
          const fetchedMsg = {
            from: parsed["return-path"][0],
            subj: parsed.subject[0],
            body,
          };
          log.info(fetchedMsg, "fetchedMsg");
          analyzeEmail(fetchedMsg);
        });
      });
    });
  });
};
