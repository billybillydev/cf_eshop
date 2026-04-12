import { favoriteSchema } from "$/db/schemas/favorite.schema";
import { CustomerFavoriteDTO } from "@eshop/business/domain/dtos";
import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const customerSchema = sqliteTable("customers", {
    id: integer().primaryKey(),
    username: text().notNull().unique(),
    firstname: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
});

export const customerRelations = relations(customerSchema, ({ many }) => ({
    favorites: many(favoriteSchema),
}));

export type SelectCustomer = typeof customerSchema.$inferSelect;
export type InsertCustomer = typeof customerSchema.$inferInsert;

export type Customer = {
    id: SelectCustomer["id"];
    username: SelectCustomer["username"];
    firstname: SelectCustomer["firstname"];
    email: SelectCustomer["email"];
    password: SelectCustomer["password"];
    favorites: Array<CustomerFavoriteDTO>;
}