import {
  CategoryDTO
} from "$domain/dtos/category.dto";
import { ProductEntity } from "$domain/entities";

export type ProductDTO = {
  id: ReturnType<ProductEntity["id"]["value"]>;
  name: ProductEntity["name"];
  code: ProductEntity["code"];
  description: ProductEntity["description"];
  quantity?: ProductEntity["quantity"];
  image: ProductEntity["image"];
  price: ReturnType<ProductEntity["price"]["getValue"]>;
  category: CategoryDTO;
  internalReference: ProductEntity["internalReference"];
  shellId: ReturnType<ProductEntity["shellId"]["value"]>;
  inventoryStatus?: ProductEntity["inventoryStatus"];
  rating?: ProductEntity["rating"];
  createdAt?: ProductEntity["createdAt"];
  updatedAt?: ProductEntity["updatedAt"];
};