import { db } from "$db";
import { Category } from "$db/schemas/category.schema";
import { CategoryEntity } from "@eshop/business/domain/entities";
import { IdObject } from "@eshop/business/domain/value-objects";
import { CategoryRepositoryInterface } from "@eshop/business/infrastructure/ports";


export class CategoryRepository implements CategoryRepositoryInterface {
  async getAll(): Promise<CategoryEntity[]> {
    try {
      const res = await db.query.categorySchema.findMany();
      return res.map(this.convertModelToEntity);
    } catch (error) {
        console.error(error);
        return [];
    }
  }

  async getById(id: IdObject): Promise<CategoryEntity | null> {
    throw new Error("Method not implemented.");
  }

  private convertModelToEntity(category: Category): CategoryEntity {
    return new CategoryEntity({
      id: new IdObject(category.id),
      name: category.name
    });
  }
}