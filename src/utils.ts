import { CommandHandler, CommandRegistry } from "./types";

export function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    console.log(`Unknown command: ${cmdName}`);
    process.exit(1);
  }
  await handler(cmdName, ...args);
}
