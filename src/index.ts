import Imap from "node-imap";
import { onSearchUnseen } from "./IMAP/search.js";
import { log } from "./log.js";
import { createIMAP } from "./IMAP/create.js";

const onOpenBox = (imap: Imap) => (err: Error, box: Imap.Box) => {
  if (err) {
    log.error(err);
    return;
  }
  log.debug(box, "box");
  const { messages } = box;
  log.info(messages, "messages");
  log.info(imap.search(["UNSEEN"], onSearchUnseen(imap)), "unseen");
};

const connectAndCheck = (imap: Imap) => {
  imap.connect();
  imap.once("ready", () => {
    imap.openBox("INBOX", true, onOpenBox(imap));
  });
};

const createIMAPResult = createIMAP();
if (createIMAPResult) {
  const { IMAP, msReconnect } = createIMAPResult;
  log.info("Establishing initial connection");
  connectAndCheck(IMAP);
  setInterval(() => {
    IMAP.end();
    log.info("Reconnecting");
    connectAndCheck(IMAP);
  }, msReconnect);
}
