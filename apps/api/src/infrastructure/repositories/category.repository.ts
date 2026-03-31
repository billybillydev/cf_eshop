import { AppBindings } from "$config/bindings";
import { Category } from "$db/schemas/category.schema";
import { D1DBRepository } from "$infrastructure/repositories/d1-db.repository";
import { CategoryEntity } from "@eshop/business/domain/entities";
import { IdObject } from "@eshop/business/domain/value-objects";
import { CategoryRepositoryInterface } from "@eshop/business/infrastructure/ports";

export class CategoryRepository extends D1DBRepository implements CategoryRepositoryInterface {
  constructor(bindingName: AppBindings["DB"]) {
    super(bindingName);
  }

  async getAll(): Promise<CategoryEntity[]> {
    try {
      const res = await this.db.query.categorySchema.findMany();
      return res.map(this.convertModelToEntity);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async getById(id: IdObject): Promise<CategoryEntity | null> {
    throw new Error("Method not implemented.");
  }

  private convertModelToEntity(category: Category): CategoryEntity {
    return new CategoryEntity({
      id: category.id,
      name: category.name,
    });
  }
}
