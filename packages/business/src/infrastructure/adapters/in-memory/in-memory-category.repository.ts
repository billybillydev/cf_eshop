import { CategoryEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import { CategoryRepositoryInterface } from "$infrastructure/ports";

export class InMemoryCategoryRepository implements CategoryRepositoryInterface {
  private readonly categories: CategoryEntity[] = [
    {
      id: 1,
      name: "computers",
    },
    {
      id: 2,
      name: "kids",
    },
    {
      id: 3,
      name: "jewelery",
    },
    {
      id: 4,
      name: "shoes",
    },
    {
      id: 5,
      name: "garden",
    },
  ].map((category) => new CategoryEntity(category));

  getAll(): Promise<CategoryEntity[]> {
    return Promise.resolve(this.categories);
  }

  getById(id: IdObject): Promise<CategoryEntity | null> {
    const existingCategory = this.categories.find((category) =>
      category.id.equals(id)
    );

    return Promise.resolve(existingCategory ?? null);
  }
}
