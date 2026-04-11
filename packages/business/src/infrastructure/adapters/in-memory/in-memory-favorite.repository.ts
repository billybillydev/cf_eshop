import { CustomerDTO, CustomerFavoriteDTO } from "$domain/dtos";
import { FavoriteVO, IdObject } from "$domain/value-objects";
import {
  FavoriteRepositoryInterface,
  ResultResponse,
} from "$infrastructure/ports/favorite.repository.interface";

export class InMemoryFavoriteRepository implements FavoriteRepositoryInterface {
  favorites: Array<{ customerId: CustomerDTO["id"] } & CustomerFavoriteDTO> =
    [];

  getAllByCustomerId(customerId: IdObject): Promise<Array<FavoriteVO>> {
    return Promise.resolve(
      this.favorites
        .filter((favorite) => favorite.customerId === customerId.value())
        .map(({ customerId, ...restFavorite }) => new FavoriteVO(restFavorite))
    );
  }

  add(
    customerId: IdObject,
    favorite: FavoriteVO
  ): Promise<ResultResponse> {
    if (
      this.favorites.some(
        (f) =>
          f.customerId === customerId.value() &&
          f.productId === favorite.productId.value()
      )
    ) {
      return Promise.resolve({
        success: false,
        message: "Product is already in favorites",
      });
    }

    this.favorites.push({
      customerId: customerId.value(),
      ...favorite.transformToDTO(),
    });

    return Promise.resolve({ success: true });
  }

  remove(
    customerId: IdObject,
    productId: IdObject
  ): Promise<ResultResponse> {
    const favoriteIndex = this.favorites.findIndex(
      (fav) =>
        fav.customerId === customerId.value() &&
        fav.productId === productId.value()
    );
    if (favoriteIndex === -1) {
      return Promise.resolve({
        success: false,
        message: "Product is not in favorites",
      });
    }

    this.favorites.splice(favoriteIndex, 1);
    return Promise.resolve({ success: true });
  }
}
