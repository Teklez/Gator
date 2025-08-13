import { getNextFeedToFetch, markFeedFetched } from "src/db/queries/feeds";
import { fetchFeed } from "./feed";

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  await markFeedFetched(nextFeed.id);

  const feed = await fetchFeed(nextFeed.url);
  for (let item of feed.item) {
    console.log(item);
  }
}
