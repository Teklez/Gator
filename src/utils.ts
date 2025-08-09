import { loginHandler } from "./commandHandler";
import { CommandHandler, CommandRegistry } from "./types";

export function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    console.log(`Unknown command: ${cmdName}`);
    process.exit(1);
  }
  handler(cmdName, ...args);
}
