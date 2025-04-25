MailBot is a prototype of a Typescript tool allowing to send commands to your server by email.

## Disclaimer

This is just an example not intended to be used in serious projects. This script should be used very cautiously, since it exposes a way to control you machine by just sending an email.

## Installation

1. git clone
2. npm ci
3. Configure your email settings in the `.env` file (see .env-example).
4. npm run build

## Usage

The server script can be run e.g. by npm run start.

It is expected to check your IMAP server (e.g. imap.gmail.com) for UNSEEN messages after each <reconnect> milliseconds and run the corresponding server function configured in commands.ts, if the subject of the email equals to the name of the command.

It is recommended to set _onlyFrom_ parameter so that only emails from the specified address could trigger a command.

After a command is executed, it should mark the message as SEEN and send back a response email with the results of the command.

E.g. if it detects a new message with Subject=NOW, it sends a response message with the current time.

## Configuration

Environment parameters

The application requires the following environment variables to be set in the .env file:

| Variable     | Description                     | Example value        |
| ------------ | ------------------------------- | -------------------- |
| host         | IMAP server host                | imap.gmail.com       |
| user         | IMAP username                   | your-email@gmail.com |
| password     | IMAP password                   | your-password        |
| port         | IMAP server port                | 993                  |
| reconnect    | Reconnection interval in ms     | 10000                |
| onlyFrom     | Filter emails from this address | your-email@gmail.com |
| smtpHost     | SMTP server host                | smtp.gmail.com       |
| smtpUser     | SMTP username                   | your-email@gmail.com |
| smtpPassword | SMTP password                   | your-password        |
