import {
  addFeedHandler,
  aggHandler,
  feedsHandler,
  loginHandler,
  registerHandler,
  resetHandler,
  usersHandler,
} from "./commandHandler";
import { CommandRegistry } from "./types";
import { registerCommand, runCommand } from "./utils";

async function main() {
  const registry: CommandRegistry = {};
  registerCommand(registry, "login", loginHandler);
  registerCommand(registry, "register", registerHandler);
  registerCommand(registry, "reset", resetHandler);
  registerCommand(registry, "users", usersHandler);
  registerCommand(registry, "agg", aggHandler);
  registerCommand(registry, "addfeed", addFeedHandler);
  registerCommand(registry, "feeds", feedsHandler);

  let commandlineArgs = process.argv;
  if (commandlineArgs.length <= 2) {
    console.log(" Not enough arguments were provided");
    process.exit(1);
  }

  const commandName = commandlineArgs[2];
  const args = commandlineArgs.slice(3);
  try {
    await runCommand(registry, commandName, ...args);
  } catch (e) {
    console.log(`Error while running ${commandName} command: ${e}`);
  }

  process.exit(0);
}

main();
