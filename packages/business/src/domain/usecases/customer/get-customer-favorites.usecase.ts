import { FavoriteVO, IdObject } from "$domain/value-objects";
import {
    FavoriteRepositoryInterface
} from "$infrastructure/ports";

type GetCustomerFavoritesInput = {
  customerId: number;
};

export class GetCustomerFavoritesUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepositoryInterface
  ) {}

  async execute(input: GetCustomerFavoritesInput): Promise<Array<FavoriteVO>> {
    const favorites = await this.favoriteRepository.getAllByCustomerId(
      new IdObject(input.customerId)
    );

    return favorites;
  }
}
