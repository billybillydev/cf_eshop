import { FavoriteEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import { FavoriteRepositoryInterface } from "$infrastructure/ports/favorite.repository.interface";

export class GetFavoritesUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepositoryInterface
  ) {}

  async execute(customerId: IdObject): Promise<FavoriteEntity[]> {
    return this.favoriteRepository.getAll(customerId);
  }
}
