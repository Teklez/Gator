import { feeds } from "../schema";
import { db } from "..";
import { readConfig } from "src/config";
import { getUserByName } from "./users";
import { users } from "../schema";
import { eq, sql } from "drizzle-orm";
import { date } from "drizzle-orm/mysql-core";
import { Feed } from "src/types";

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

export async function getFeedByUrl(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed;
}

export async function markFeedFetched(feedId: string) {
  const now = new Date();

  await db
    .update(feeds)
    .set({
      updatedAt: now,
      lastFetchedAt: now,
    })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
  const [result] = await db.execute(
    sql.raw("SELECT * FROM feeds ORDER BY last_fetched_at ASC NULLS FIRST;")
  );
  return result as Feed;
}
