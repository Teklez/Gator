import { feeds } from "../schema";
import { db } from "..";
import { readConfig } from "src/config";
import { getUserByName } from "./users";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export async function addFeed(name: string, url: string) {
  const currentUser = readConfig()?.currentUserName || "";
  const userId = (await getUserByName(currentUser)).id;
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
    .returning();
  return result;
}

export async function getFeeds() {
  const result = await db
    .select({
      feedName: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .leftJoin(users, eq(users.id, feeds.userId));
  return result;
}
