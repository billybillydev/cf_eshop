import { customerSchema } from "$db/schemas/customer.schema";
import { productSchema } from "$db/schemas/product.schema";
import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const favoriteSchema = sqliteTable("favorites", {
  id: integer().primaryKey({ autoIncrement: true }),
  productId: integer("product_id")
    .notNull()
    .references(() => productSchema.id),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customerSchema.id),
  productImage: text("product_image").notNull(),
  inventoryStatus: text("inventory_status").notNull(),
});

export const favoriteRelations = relations(favoriteSchema, ({ one }) => ({
  product: one(productSchema, {
    fields: [favoriteSchema.productId],
    references: [productSchema.id],
  }),
  customer: one(customerSchema, {
    fields: [favoriteSchema.customerId],
    references: [customerSchema.id],
  }),
}));

export type SelectFavorite = typeof favoriteSchema.$inferSelect;
export type InsertFavorite = typeof favoriteSchema.$inferInsert;
