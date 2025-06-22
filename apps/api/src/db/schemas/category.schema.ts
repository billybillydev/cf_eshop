import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const categorySchema = sqliteTable("categories", {
  id: integer().primaryKey(),
  name: text().notNull(),
});

export type SelectCategory = typeof categorySchema.$inferSelect;
export type InsertCategory = typeof categorySchema.$inferInsert;

export type Category = {
  id: SelectCategory["id"];
  name: SelectCategory["name"];
};