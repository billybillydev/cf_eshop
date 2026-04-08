import { FavoriteDTO } from "$domain/dtos/favorite/favorite.dto";

export type AddFavoriteDTO = Omit<FavoriteDTO, "id">;
