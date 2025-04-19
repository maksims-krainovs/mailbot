import log from "./index.js";

const commands: Record<string, () => void> = {
  "test 3": () => console.warn(new Date()),
};

export const analyzeEmail =
  () => (email: { from: string; subj: string; body: string }) => {
    const { from, subj } = email;
    if (from === "mkmailbot@murena.io") {
      if (commands[subj]) {
        log.warn("EXEC COMMAND: " + subj);
        commands[subj]();
      }
    }
  };
