import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schemas/*",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:sqlite.db",
  },
});
