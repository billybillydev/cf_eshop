import { AppBindings } from "$config/bindings";
import { favoriteSchema } from "$db/schemas";
import { D1DBRepository } from "$infrastructure/repositories/d1-db.repository";
import { AddFavoriteDTO } from "@eshop/business/domain/dtos";
import { FavoriteEntity } from "@eshop/business/domain/entities";
import { IdObject } from "@eshop/business/domain/value-objects";
import { FavoriteRepositoryInterface } from "@eshop/business/infrastructure/ports";
import { and, eq } from "drizzle-orm";

export class FavoriteRepository
  extends D1DBRepository
  implements FavoriteRepositoryInterface
{
  constructor(bindingName: AppBindings["DB"]) {
    super(bindingName);
  }

  async add(data: AddFavoriteDTO): Promise<FavoriteEntity> {
    const existing = await this.db.query.favoriteSchema.findFirst({
      where: (fields, { eq, and }) =>
        and(
          eq(fields.customerId, data.customerId),
          eq(fields.productId, data.productId)
        ),
    });

    if (existing) {
      throw new Error("Favorite already exists");
    }

    const [inserted] = await this.db
      .insert(favoriteSchema)
      .values({
        productId: data.productId,
        customerId: data.customerId,
        productImage: data.productImage,
        inventoryStatus: data.inventoryStatus,
      })
      .returning();

    return new FavoriteEntity({
      id: inserted.id,
      productId: inserted.productId,
      customerId: inserted.customerId,
      productImage: inserted.productImage,
      inventoryStatus: inserted.inventoryStatus as FavoriteEntity["inventoryStatus"],
    });
  }

  async delete(
    customerId: IdObject,
    productId: IdObject
  ): Promise<FavoriteEntity> {
    const existing = await this.db.query.favoriteSchema.findFirst({
      where: (fields, { eq, and }) =>
        and(
          eq(fields.customerId, customerId.value()),
          eq(fields.productId, productId.value())
        ),
    });

    if (!existing) {
      throw new Error("Favorite not found");
    }

    await this.db
      .delete(favoriteSchema)
      .where(
        and(
          eq(favoriteSchema.customerId, customerId.value()),
          eq(favoriteSchema.productId, productId.value())
        )
      );

    return new FavoriteEntity({
      id: existing.id,
      productId: existing.productId,
      customerId: existing.customerId,
      productImage: existing.productImage,
      inventoryStatus: existing.inventoryStatus as FavoriteEntity["inventoryStatus"],
    });
  }

  async getAll(customerId: IdObject): Promise<FavoriteEntity[]> {
    const results = await this.db.query.favoriteSchema.findMany({
      where: (fields, { eq }) => eq(fields.customerId, customerId.value()),
    });

    return results.map(
      (row) =>
        new FavoriteEntity({
          id: row.id,
          productId: row.productId,
          customerId: row.customerId,
          productImage: row.productImage,
          inventoryStatus: row.inventoryStatus as FavoriteEntity["inventoryStatus"],
        })
    );
  }
}
