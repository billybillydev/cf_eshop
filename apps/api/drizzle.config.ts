import { type Config } from "drizzle-kit";
import { config } from "./src/config"

const dbCredentials = {
  url: config.db.url,
};

export default {
  dialect: "sqlite",
  schema: "./src/db/schemas/index.ts",
  out: "./migrations",
  dbCredentials,
  verbose: false,
  strict: true,
  tablesFilter: ["!libsql_wasm_func_table"],
} satisfies Config;
