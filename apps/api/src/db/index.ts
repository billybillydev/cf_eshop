import { config } from "$config";
import * as schema from "$db/schemas";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// const options = (() => {
//   switch (config.db.type) {
//     case "local":
//     default:
//       return {
//         url: "file:sqlite.db",
//       };
//   }
// })();

export const client = createClient({ url: config.db.url });

// if (config.db.type === "local-replica") {
//   await client.sync();
// }

// export const db = drizzle(client, { schema, logger: false });

export const db = drizzle(client, { schema, logger: true });