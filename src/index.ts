import Imap from "node-imap";
import { createIMAP } from "./IMAP.js";

const createIMAPResult = createIMAP();
if (createIMAPResult) {
  const { IMAP, msReconnect } = createIMAPResult;
  IMAP.once("ready", () => {
    IMAP.openBox("INBOX", true, onOpenBox);
  });

  const onOpenBox = (err: Error, box: Imap.Box) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(box);
    const { messages } = box;
    console.log("messages", messages);
    console.log("unseen", IMAP.search(["UNSEEN"], onSearchUnseen));
  };

  const onSearchUnseen = (err: Error, uids: number[]) => {
    if (err) {
      console.error(err);
      return;
    }
    uids.forEach((uid) => {
      console.log("GETTING", uid);
      const fetchResult = IMAP.fetch(uid, {
        bodies: ["HEADER.FIELDS (FROM SUBJECT DATE)", "TEXT"],
      });
      fetchResult.on("message", (msg, seqno) => {
        console.log("seqno", seqno);
        let buffer = "";
        let body = "";
        msg.on("body", (stream, info) => {
          stream.on("data", (chunk) => {
            console.log("data chunk", chunk);
            const strChunk = chunk.toString("utf8");
            buffer += strChunk;
            if (info.which === "TEXT") {
              body += strChunk;
            }
          });
          stream.on("end", () => {
            const parsed = Imap.parseHeader(buffer);
            const fetchedMsg = {
              from: parsed.from,
              subj: parsed.subject,
              body,
            };
            console.log("fetchedMsg", fetchedMsg);
            IMAP.end();
          });
        });
      });
    });
    console.log("uids", uids);
  };

  setInterval(() => IMAP.connect(), Number(msReconnect));
}
