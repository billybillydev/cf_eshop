import { AddFavoriteDTO } from "$domain/dtos/favorite";
import { FavoriteEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";

export interface FavoriteRepositoryInterface {
  add(data: AddFavoriteDTO): Promise<FavoriteEntity>;
  delete(customerId: IdObject, productId: IdObject): Promise<FavoriteEntity>;
  getAll(customerId: IdObject): Promise<FavoriteEntity[]>;
}
