export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandRegistry = Record<string, CommandHandler>;

