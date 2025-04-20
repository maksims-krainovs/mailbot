import { analyzeEmail } from "../process.js";
import Imap from "node-imap";
import { log } from "../log.js";

export const onSearchUnseen = (imap: Imap) => (err: Error, uids: number[]) => {
  log.debug(uids, "uids");
  if (err) {
    log.error(err);
    return;
  }
  uids.forEach((uid) => {
    log.debug("getting " + uid);
    const fetchResult = imap.fetch(uid, {
      bodies: ["HEADER.FIELDS (FROM SUBJECT)", "TEXT"],
    });
    fetchResult.on("message", (msg, seqno) => {
      log.debug("seqno: " + seqno);
      let headers = "";
      let body = "";
      msg.on("body", (stream, info) => {
        log.debug(info, "body event");
        stream.on("data", (chunk: unknown) => {
          log.debug(chunk, "data chunk");
          const strChunk = chunk?.toString();
          if (info.which === "TEXT") {
            body += strChunk;
          } else {
            headers += strChunk;
          }
        });
      });
      msg.once("end", () => {
        log.debug("HEADERS");
        log.debug(headers);
        log.debug("BODY");
        log.debug(body);
        const parsed = Imap.parseHeader(headers);
        log.debug(parsed, "parsed");
        if (parsed?.from && parsed.subject) {
          const fetchedMsg = {
            from: parsed.from[0],
            subj: parsed.subject[0],
            body,
          };
          log.debug(fetchedMsg, "fetchedMsg");
          const processed = analyzeEmail(fetchedMsg);
          if (processed) {
            log.debug("Trying to set the flag");
            imap.setFlags([uid], ["\\Seen"], (e) => {
              if (e) {
                log.error("Error setting SEEN flag for " + uid, e);
              } else {
                log.info("SEEN flag has been set for " + uid);
              }
            });
          }
        }
      });
    });
  });
};
