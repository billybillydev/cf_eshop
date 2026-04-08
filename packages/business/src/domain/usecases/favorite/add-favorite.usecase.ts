import { AddFavoriteDTO } from "$domain/dtos/favorite";
import { FavoriteEntity } from "$domain/entities";
import { FavoriteRepositoryInterface } from "$infrastructure/ports/favorite.repository.interface";

export class AddFavoriteUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepositoryInterface
  ) {}

  async execute(data: AddFavoriteDTO): Promise<FavoriteEntity> {
    return this.favoriteRepository.add(data);
  }
}
