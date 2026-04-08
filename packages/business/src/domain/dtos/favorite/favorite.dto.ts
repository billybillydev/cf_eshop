import { FavoriteEntity } from "$domain/entities/favorite/favorite.entity";

export type FavoriteDTO = {
  id: ReturnType<FavoriteEntity["id"]["value"]>;
  productId: ReturnType<FavoriteEntity["productId"]["value"]>;
  customerId: ReturnType<FavoriteEntity["customerId"]["value"]>;
  productImage: FavoriteEntity["productImage"];
  inventoryStatus: FavoriteEntity["inventoryStatus"];
};
