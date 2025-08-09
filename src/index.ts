import { CommandRegistry } from "./types";
import { registerCommand, runCommand } from "./utils";
import { loginHandler } from "./commandHandler";

function main() {
  const registry: CommandRegistry = {};
  registerCommand(registry, "login", loginHandler);

  let commandlineArgs = process.argv;
  if (commandlineArgs.length <= 2) {
    console.log(" Not enough arguments were provided");
    process.exit(1);
  }

  const commandName = commandlineArgs[2];
  const args = commandlineArgs.slice(3);
  try {
    runCommand(registry, commandName, ...args);
  } catch (e) {
    console.log(`Error while running ${commandName} command: ${e}`);
  }
}

main();
