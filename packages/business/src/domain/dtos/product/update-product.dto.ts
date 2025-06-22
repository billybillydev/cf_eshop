import { ProductDTO, CategoryDTO } from "$domain/dtos";

export type UpdateProductDTO = Partial<
  Omit<
    ProductDTO,
    "id" | "createdAt" | "updatedAt" | "inventoryStatus" | "code"
  > & {
    category: CategoryDTO;
  }
>;
