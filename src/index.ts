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
  log.debug(messages, "messages");
  const searchParams: (string | string[])[] = ["UNSEEN"];
  const { onlyFrom } = process.env;
  if (onlyFrom) {
    searchParams.push(["FROM", onlyFrom]);
  }
  imap.search(searchParams, onSearchUnseen(imap));
};

const connectAndCheck = (imap: Imap, reconnect: number) => {
  try {
    setTimeout(() => {
      setTimeout(() => {
        log.info("Reconnecting");
        connectAndCheck(imap, reconnect);
      }, 4985);
      log.info("Ending the connection");
      imap.end();
    }, reconnect - 5000);
    imap.connect();
    imap.once("ready", () => {
      imap.openBox("INBOX", false, onOpenBox(imap));
    });
  } catch (e) {
    log.error(e);
  }
};

process.on("warning", (e) => log.warn(e.stack));
try {
  const createIMAPResult = createIMAP();
  if (createIMAPResult) {
    const { IMAP, msReconnect } = createIMAPResult;
    IMAP.once("error", function (err) {
      log.error(err);
    });
    log.info("Establishing initial connection");
    try {
      connectAndCheck(IMAP, msReconnect);
    } catch (e) {
      log.error(e);
    }
  }
} catch (e) {
  log.error(e);
}
