import nodemailer from "nodemailer";
export const sendEmail = async (
  emailAddr: string,
  responseSubj: string,
  html: string,
) => {
  const transport = nodemailer.createTransport({
    host: "mail.ecloud.global",
    port: 587,
    secure: false,
    auth: {
      user: "mkmailbot@murena.io",
      pass: "''",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const result = await transport.sendMail({
    from: "mkmailbot@murena.io",
    to: emailAddr,
    subject: responseSubj,
    html,
  });
  console.log(result);
};
