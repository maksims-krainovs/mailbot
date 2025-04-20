import nodemailer from "nodemailer";
import { commands } from "./commands.js";
import { log } from "./log.js";

export const analyzeEmail = (email: {
  from: string;
  subj: string;
  body: string;
}) => {
  const { from, subj } = email;
  const { onlyFrom } = process.env;
  if (!onlyFrom || from.indexOf(onlyFrom) > -1) {
    if (commands[subj]) {
      log.info("EXECUTING COMMAND: " + subj);
      const commandResult = commands[subj]();
      sendEmail(from, "Result of " + subj, commandResult);
      return true;
    }
  }
  return false;
};

export const sendEmail = async (
  emailAddr: string,
  responseSubj: string,
  html: string,
) => {
  const { smtpHost, smtpUser, smtpPassword } = process.env;
  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: 587,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const result = await transport.sendMail({
    to: emailAddr,
    subject: responseSubj,
    html,
  });
  log.debug(result);
};
