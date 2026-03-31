import { CategoryDTO } from "$domain/dtos/category.dto";
import { IdObject } from "$domain/value-objects/id.object-value";

export class CategoryEntity {
  readonly id: IdObject;
  readonly name: string;

  constructor(dto: CategoryDTO) {
    this.id = new IdObject(dto.id);
    this.name = dto.name;
  }

  transformToDTO(): CategoryDTO {
    return { id: this.id.value(), name: this.name };
  }
}
