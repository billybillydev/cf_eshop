import { Category, categorySchema } from "$/db/schemas/category.schema";

import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const productSchema = sqliteTable("products", {
  id: integer().primaryKey({ autoIncrement: true }),
  code: text().notNull().unique(),
  name: text().notNull().unique(),
  description: text().notNull(),
  categoryId: integer()
    .notNull()
    .references(() => categorySchema.id),
  internalReference: text("internal_reference").notNull(),
  image: text().notNull(),
  price: real().notNull(),
  quantity: integer().notNull().$defaultFn(() => 0),
  shellId: integer("shell_id").notNull(),
  inventoryStatus: text("inventory_status").notNull(),
  rating: real().notNull().$defaultFn(() => 0),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});

export const productRelations = relations(productSchema, ({ one }) => ({
  category: one(categorySchema, {
    fields: [productSchema.categoryId],
    references: [categorySchema.id],
  }),
}));

export type SelectProduct = typeof productSchema.$inferSelect;
export type InsertProduct = typeof productSchema.$inferInsert;

export type Product = {
  id: SelectProduct["id"];
  code: SelectProduct["code"];
  name: SelectProduct["name"];
  description: SelectProduct["description"];
  category: Category;
  internalReference: SelectProduct["internalReference"];
  image: SelectProduct["image"];
  price: SelectProduct["price"];
  quantity: SelectProduct["quantity"];
  shellId: SelectProduct["shellId"];
  inventoryStatus: SelectProduct["inventoryStatus"];
  rating: SelectProduct["rating"];
  createdAt: SelectProduct["createdAt"];
  updatedAt: SelectProduct["updatedAt"];
}