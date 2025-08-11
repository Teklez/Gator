import { readConfig, setUser } from "./config";
import {
  createUser,
  getUserByName,
  getUsers,
  resetUsers,
} from "./db/queries/users";

export async function loginHandler(cmd: string, ...args: string[]) {
  if (args.length < 1) {
    console.log("A username is required.");
    process.exit(1);
  }

  const username = args[0];
  const userExists = await getUserByName(username);
  if (!userExists) {
    console.log("User doesn't exist");
    process.exit(1);
  }
  setUser(username);
}

export async function registerHandler(cmd: string, ...args: string[]) {
  if (args.length < 1) {
    console.log("A username is required.");
    process.exit(1);
  }

  const username = args[0];
  try {
    const userExists = await getUserByName(username);
    if (userExists) {
      console.log("User with this name exists try another");
      process.exit(1);
    }
    const result = await createUser(username);
    setUser(username);
  } catch (e) {
    console.log(`Error while creating user ${username}:${e}`);
    process.exit(1);
  }
}

export async function resetHandler(cmd: string) {
  try {
    await resetUsers();
    console.log("Successfully reset");
  } catch (error) {
    console.log("Reset failed");
    process.exit(1);
  }
}

export async function usersHandler(cmd: string) {
  try {
    const users = await getUsers();
    const currentUser = readConfig()?.currentUserName;
    for (let user of users) {
      const current = currentUser == user.name ? " (current)" : "";
      console.log(user.name + current);
    }
  } catch (e) {
    console.log(`Error while getting users: ${e}`);
  }
}
