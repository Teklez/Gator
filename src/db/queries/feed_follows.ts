import { and, eq } from "drizzle-orm";
import { readConfig } from "src/config";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { getFeedByUrl } from "./feeds";
import { getUserByName } from "./users";
import { UUID } from "crypto";

export async function createFeedFollow(url: string) {
  const config = readConfig();
  const userId = (await getUserByName(config?.currentUserName || "")).id;
  const feedId = (await getFeedByUrl(url)).id;
  const [result] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning();
  const [followDetails] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(and(eq(feedFollows.id, result.id), eq(users.id, userId)));
  return followDetails;
}

export async function getFeedFollowsForUser() {
  const config = readConfig();
  const userId = (await getUserByName(config?.currentUserName || "")).id;
  const result = await db
    .select({
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));

  return result;
}

export async function deleteFeedFollows(feedId: string, userId: string) {
  await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.feedId, feedId), eq(feedFollows.userId, userId)));
}
