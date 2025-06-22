import { CategoryEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import { CategoryRepositoryInterface } from "$infrastructure/ports";

export class GetCategoryByIdUseCase {
  private readonly categoryRepository!: CategoryRepositoryInterface;

  constructor(categoryRepository: CategoryRepositoryInterface) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id: IdObject): Promise<CategoryEntity | null> {
    return this.categoryRepository.getById(id);
  }
}
