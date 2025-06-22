import { CategoryEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";

export interface CategoryRepositoryInterface {
    getAll(): Promise<CategoryEntity[]>;
    getById(id: IdObject): Promise<CategoryEntity | null>;
}