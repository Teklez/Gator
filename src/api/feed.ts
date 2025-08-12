import {
  XMLParser,
  XMLBuilder,
  XMLValidator,
  XMLMetaData,
} from "fast-xml-parser";

export async function fetchFeed(feedURL: string) {
  const response = await fetch(feedURL, {
    method: "get",
    headers: {
      "User-Agent": "gator",
    },
  });

  const responseText = await response.text();
  const parser = new XMLParser();
  const parsedObj = await parser.parse(responseText);
  const obj = parsedObj.rss;
  if (!obj.channel) {
    throw new Error("Channel doesn't exist");
  }

  const { title, link, description } = obj.channel;

  const feedObject = {
    title,
    link,
    description,
    item: [],
  };

  if (Array.isArray(obj.channel.item)) {
    feedObject.item = obj.channel.item.map((item: any) => {
      const { title, link, description, pubDate } = item;
      return {
        title,
        link,
        description,
        pubDate,
      };
    });
  }

  return feedObject;
}
