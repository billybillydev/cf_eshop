
import { AppBindings } from "$/config/bindings";
import { favoriteSchema } from "$/db/schemas";
import { D1DBRepository } from "$/infrastructure/repositories/d1-db.repository";
import { IdObject, FavoriteVO } from "@eshop/business/domain/value-objects";
import {
  FavoriteRepositoryInterface,
  ResultResponse,
} from "@eshop/business/infrastructure/ports";
import { and, eq } from "drizzle-orm";

export class FavoriteRepository
  extends D1DBRepository
  implements FavoriteRepositoryInterface
{
  constructor(bindingName: AppBindings["DB"]) {
    super(bindingName);
  }

  async getAllByCustomerId(customerId: IdObject): Promise<Array<FavoriteVO>> {
    const favorites = await this.db.query.favoriteSchema.findMany({
      where: (fields, { eq }) => eq(fields.customerId, customerId.value()),
      columns: {
        productId: true,
        createdAt: true,
      },
      with: {
        product: {
          columns: {
            name: true,
            image: true,
            inventoryStatus: true,
          },
        },
      },
    });

    return favorites.map(
      (favorite) =>
        new FavoriteVO({
          productId: favorite.productId,
          createdAt: favorite.createdAt,
          productName: favorite.product.name,
          productImage: favorite.product.image,
          inventoryStatus: favorite.product.inventoryStatus,
        })
    );
  }

  async add(
    customerId: IdObject,
    favorite: FavoriteVO
  ): Promise<ResultResponse> {
    try {
      await this.db
        .insert(favoriteSchema)
        .values({
          customerId: customerId.value(),
          productId: favorite.productId.value(),
        })
        .returning();

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      return { success: false, message: "Failed to add favorite" };
    }
  }

  async remove(
    customerId: IdObject,
    productId: IdObject
  ): Promise<ResultResponse> {
    try {
      const result = await this.db
        .delete(favoriteSchema)
        .where(
          and(
            eq(favoriteSchema.customerId, customerId.value()),
            eq(favoriteSchema.productId, productId.value())
          )
        )
        .returning();

      if (result.length === 0) {
        throw new Error("No rows were deleted");
      }

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      return { success: false, message: "Failed to remove favorite" };
    }
  }
}
