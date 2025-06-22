import { CategoryDTO } from "$domain/dtos/category.dto";
import { IdObject } from "$domain/value-objects/id.object-value";

export class CategoryEntity {
  readonly id: IdObject;
  readonly name: string;

  constructor(categoryData: { id: IdObject; name: string }) {
    this.id = categoryData.id;
    this.name = categoryData.name;
  }

  transformToDTO(): CategoryDTO {
    return { id: this.id.value(), name: this.name };
  }

  static transformToEntity(categoryDTO: CategoryDTO): CategoryEntity {
    return new CategoryEntity({ ...categoryDTO, id: new IdObject(categoryDTO.id) });
  }
}
