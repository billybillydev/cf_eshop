import { AddFavoriteDTO } from "$domain/dtos/favorite";
import { FavoriteEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import type { FavoriteRepositoryInterface } from "$infrastructure/ports";

export class InMemoryFavoriteRepository implements FavoriteRepositoryInterface {
  private store: FavoriteEntity[] = [];

  async add(data: AddFavoriteDTO): Promise<FavoriteEntity> {
    const exists = this.store.some(
      (f) =>
        f.customerId.equals(new IdObject(data.customerId)) &&
        f.productId.equals(new IdObject(data.productId))
    );
    if (exists) {
      throw new Error("Favorite already exists");
    }
    const id = this.store.length + 1;
    const favorite = new FavoriteEntity({ ...data, id });
    this.store.push(favorite);
    return Promise.resolve(favorite);
  }

  async delete(customerId: IdObject, productId: IdObject): Promise<FavoriteEntity> {
    const index = this.store.findIndex(
      (f) => f.customerId.equals(customerId) && f.productId.equals(productId)
    );
    if (index < 0) {
      throw new Error("Favorite not found");
    }
    const [removed] = this.store.splice(index, 1);
    return Promise.resolve(removed);
  }

  async getAll(customerId: IdObject): Promise<FavoriteEntity[]> {
    return Promise.resolve(
      this.store.filter((f) => f.customerId.equals(customerId))
    );
  }
}
