import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categorySchema = sqliteTable('categories', {
  id: integer().primaryKey(),
  name: text().notNull(),
});

export type CreateCategory = typeof categorySchema.$inferInsert;
export type SelectCategory = typeof categorySchema.$inferSelect;