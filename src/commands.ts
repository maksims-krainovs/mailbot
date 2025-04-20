export const commands: Record<string, () => string> = {
  NOW: () => new Date().toUTCString(),
};
