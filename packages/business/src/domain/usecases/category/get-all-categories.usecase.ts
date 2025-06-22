import { CategoryEntity } from "$domain/entities";
import { CategoryRepositoryInterface } from "$infrastructure/ports";

export class GetAllCategoriesUseCase {
  private categoryRepository!: CategoryRepositoryInterface;

  constructor(categoryRepository: CategoryRepositoryInterface) {
    this.categoryRepository = categoryRepository;
  }

  execute(): Promise<CategoryEntity[]> {
    return this.categoryRepository.getAll();
  }
}