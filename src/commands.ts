import { log } from "./log.js";
import { sendEmail } from "./sendEmail.js";

const commands: Record<string, () => string> = {
  NOW: () => new Date().toUTCString(),
};

export const analyzeEmail = (email: {
  from: string;
  subj: string;
  body: string;
}) => {
  const { from, subj } = email;
  const { onlyFrom } = process.env;
  if (!onlyFrom || from.indexOf(onlyFrom) > -1) {
    if (commands[subj]) {
      log.warn("EXECUTING COMMAND: " + subj);
      const commandResult = commands[subj]();
      console.warn(from);
      sendEmail(from, "Result of " + subj, commandResult);
    }
  }
};
