import { DrizzleD1Database } from "drizzle-orm/d1";

export type AppBindings = CloudflareBindings & {
  DB: DrizzleD1Database;
};
