import { readConfig, setUser } from "./config";
import {
  createUser,
  getUserByName,
  getUsers,
  resetUsers,
} from "./db/queries/users";
import { fetchFeed } from "./api/feed";
import { except } from "drizzle-orm/gel-core";
import { addFeed, getFeeds } from "./db/queries/feeds";
import { Feed, User } from "./types";
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
    console.log(`Reset failed: ${error}`);
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

export async function aggHandler() {
  try {
    const res = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(res);
  } catch (e) {
    console.log(`Error while fetching feed:${e}`);
  }
}

export async function addFeedHandler(cmd: string, ...args: string[]) {
  if (args.length != 2) {
    console.log("Expected two arguments for the add feed");
    process.exit(1);
  }
  const [name, url] = args;

  const feed = await addFeed(name, url);
  const currentUser = readConfig()?.currentUserName || "";
  const user = await getUserByName(currentUser);

  if (!feed) {
    throw new Error("Error while creating feed.");
  }

  console.log("Feed created successfully");
  printFeed(feed, user);
}

export async function feedsHandler() {
  try {
    const feeds = await getFeeds();
    for (let feed of feeds) {
      console.log("-----------------------------------------------Feeds--------------------------------------------")
      console.log(`${feed.feedName}`);
      console.log(`${feed.url}`);
      console.log(`${feed.userName}`);
      console.log("-------------------------------------------------------------------------------------------------")
    }
  } catch (e) {}
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
