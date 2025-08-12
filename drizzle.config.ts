import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const dbUrl = readConfig()?.dbUrl ?? "";

export default defineConfig({
  schema: "/home/zemen/Software-Development/projects/Gator/src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
