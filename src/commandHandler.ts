import { fetchFeed } from "./api/feed";
import { scrapeFeeds } from "./api/scrape";
import { readConfig, setUser } from "./config";
import {
  createFeedFollow,
  deleteFeedFollows,
  getFeedFollowsForUser,
} from "./db/queries/feed_follows";
import { addFeed, getFeedByUrl, getFeeds } from "./db/queries/feeds";
import {
  createUser,
  getUserByName,
  getUsers,
  resetUsers,
} from "./db/queries/users";
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

export async function aggHandler(cmd: string, ...args: string[]) {
  if (!args) {
    console.log("time between requests is required");
    process.exit(1);
  }

  const timeBetweenRequests = parseDuration(args[0]);
  const span = timeBetweenRequests![2];
  const intr: number = Number(timeBetweenRequests![1]);
  let timeBet;
  switch (span) {
    case "h":
      timeBet = intr * 60 * 60 * 1000;
      break;
    case "m":
      timeBet = intr * 60 * 1000;
      break;
    case "s":
      timeBet = intr * 1000;
      break;
    default:
      timeBet = 1000;
  }

  scrapeFeeds().catch((e) => {
    console.log(e);
  });
  console.log(`Collecting feeds every ${timeBet}${span}`);
  const interval = setInterval(() => {
    scrapeFeeds().catch((e) => {
      console.log(e);
    });
  }, timeBet);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function addFeedHandler(
  cmd: string,
  user: User,
  ...args: string[]
) {
  if (args.length != 2) {
    console.log("Expected two arguments for the add feed");
    process.exit(1);
  }
  const [name, url] = args;

  const feed = await addFeed(name, url);
  if (!feed) {
    throw new Error("Error while creating feed.");
  }

  await createFeedFollow(url);

  console.log("Feed created successfully");
  printFeed(feed, user);
}

export async function feedsHandler() {
  try {
    const feeds = await getFeeds();
    for (let feed of feeds) {
      console.log(
        "-----------------------------------------------Feeds--------------------------------------------"
      );
      console.log(`${feed.feedName}`);
      console.log(`${feed.url}`);
      console.log(`${feed.userName}`);
      console.log(
        "-------------------------------------------------------------------------------------------------"
      );
    }
  } catch (e) {
    console.log(`Error while fetching feeds: ${e}`);
  }
}

export async function followHandler(
  cmd: string,
  user: User,
  ...args: string[]
) {
  try {
    if (!args) {
      console.log("Url is required");
      process.exit(1);
    }
    const url = args[0];
    const res = await createFeedFollow(url);
    console.log(res.feedName);
    console.log(res.userName);
  } catch (e) {
    console.log(`Error while following: ${e}`);
  }
}

export async function unfollowHandler(
  cmd: string,
  user: User,
  ...args: string[]
) {
  if (!args) {
    console.log("Url is required");
    process.exit(1);
  }

  const url = args[0];
  const feedId = (await getFeedByUrl(url)).id;
  if (!feedId) {
    console.log("Feed doesn't exist");
  }

  try {
    await deleteFeedFollows(feedId, user.id);
  } catch (error) {}
}

export async function followingHandler(
  cmd: string,
  user: User,
  ...args: string[]
) {
  try {
    const followingFeeds = await getFeedFollowsForUser();
    console.log(
      "-------------------------------------------FOLLOWING FEEDS--------------------------------------------"
    );

    for (let feed of followingFeeds) {
      console.log(feed.feedName);
    }
  } catch (e) {
    console.log(`Error while fetching following feeds: ${e}`);
  }
}

// HELPERS

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    console.log("Please inter a valid interval like 1m, 1s, 1h etc...");
  }
  return match;
}
