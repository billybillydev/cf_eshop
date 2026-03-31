import { Config } from "drizzle-kit";
import { config } from "./src/config";

export default {
  schema: "./src/db/schemas",
  out: ".drizzle-out",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: config.db.accountId,
    databaseId: config.db.databaseId,
    token: config.db.token,
  },
} satisfies Config;
