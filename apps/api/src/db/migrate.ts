import { db } from "$db";
import { readMigrationFiles } from "drizzle-orm/migrator";

(async () => {
  try {
    await readMigrationFiles({
      migrationsFolder: "./migrations",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
})()
