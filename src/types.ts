import { feeds } from "./db/schema";
import { users } from "./db/schema";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type CommandRegistry = Record<string, CommandHandler>;

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;

export type FeedItem = {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
};
