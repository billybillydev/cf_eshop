import { CategoryEntity } from "$domain/entities";

export type CategoryDTO = {
  id: ReturnType<CategoryEntity["id"]["value"]>;
  name: string;
};
