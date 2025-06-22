import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const userSchema = sqliteTable("users", {
    id: integer().primaryKey(),
    username: text().notNull(),
    firstname: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
});

export type SelectUser = typeof userSchema.$inferSelect;
export type InsertUser = typeof userSchema.$inferInsert;

export type User = {
    id: SelectUser["id"];
    username: SelectUser["username"];
    firstname: SelectUser["firstname"];
    email: SelectUser["email"];
    password: SelectUser["password"];
}