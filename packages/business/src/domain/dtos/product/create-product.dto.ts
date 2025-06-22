import { ProductDTO, CategoryDTO } from "$domain/dtos";

export type CreateProductDTO = Omit<
  ProductDTO,
  "id" | "createdAt" | "updatedAt" | "inventoryStatus" | "code" | "rating"
> & {
  category: CategoryDTO;
};