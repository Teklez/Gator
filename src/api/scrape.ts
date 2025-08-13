import { getNextFeedToFetch, markFeedFetched } from "src/db/queries/feeds";
import { fetchFeed } from "./feed";
import { createPost } from "src/db/queries/posts";

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  await markFeedFetched(nextFeed.id);

  const feed = await fetchFeed(nextFeed.url);
  for (let item of feed.item) {
    try {
      await createPost(
        item.title,
        item.link,
        item.description,
        new Date(item.pubDate),
        nextFeed.id
      );
    } catch (e) {
      console.log(`Error while creating posts: ${e}`);
    }
  }
}
