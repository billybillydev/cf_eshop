import { customerSchema } from "$db/schemas/customer.schema";
import { productSchema } from "$db/schemas/product.schema";
import { relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";

export const favoriteSchema = sqliteTable(
  "favorites",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => productSchema.id),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customerSchema.id),
    createdAt: integer("created_at")
      .notNull()
      .$defaultFn(() => Date.now()),
  },
  (table) => [primaryKey({ columns: [table.customerId, table.productId] })]
);

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
