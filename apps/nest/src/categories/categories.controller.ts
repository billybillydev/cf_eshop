import { Controller, Get } from '@nestjs/common';
import { GetAllCategoriesUseCase } from '@eshop/business/domain/usecases/category';
import { CategoriesRepository } from './categories.repository';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  @Get()
  async getAll() {
    const useCase = new GetAllCategoriesUseCase(this.categoriesRepository);
    const categories = await useCase.execute();

    return categories.map((category) => category.transformToDTO());
  }
}
