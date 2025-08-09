import { setUser } from "./config";

export function loginHandler(cmd: string, ...args: string[]) {
  if (args.length < 1) {
    console.log("A username is required.");
    process.exit(1);
  }

  const username = args[0];
  setUser(username);
}
