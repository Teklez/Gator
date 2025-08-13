import { asc } from "drizzle-orm";
import { db } from "..";
import { posts } from "../schema";

export async function createPost(
  title: string,
  url: string,
  description: string,
  publishedAt: Date,
  feedId: string
) {


  const [result] = await db
    .insert(posts)
    .values({
      title,
      url,
      description,
      publishedAt,
      feedId,
    })
    .returning();

  return result;
}

export async function getPostsForUser(limit: number) {
  const result = await db
    .select()
    .from(posts)
    .limit(limit)
    .orderBy(asc(posts.createdAt));

  return result;
}
