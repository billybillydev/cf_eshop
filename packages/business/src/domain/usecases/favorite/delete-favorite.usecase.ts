import { FavoriteEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import { FavoriteRepositoryInterface } from "$infrastructure/ports/favorite.repository.interface";

export class DeleteFavoriteUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepositoryInterface
  ) {}

  async execute(customerId: IdObject, productId: IdObject): Promise<FavoriteEntity> {
    return this.favoriteRepository.delete(customerId, productId);
  }
}
