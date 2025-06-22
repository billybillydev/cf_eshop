import { CategoryDTO } from "$domain/dtos";
import { ProductItemEntity } from "$domain/entities";

export type ProductItemDTO = {
  id: ReturnType<ProductItemEntity["id"]["value"]>;
  name: ProductItemEntity["name"];
  code: ProductItemEntity["code"];
  category: CategoryDTO;
  price: ReturnType<ProductItemEntity["price"]["getValue"]>;
  image: ProductItemEntity["image"];
  internalReference: ProductItemEntity["internalReference"];
  shellId: ReturnType<ProductItemEntity["shellId"]["value"]>;
  inventoryStatus: ProductItemEntity["inventoryStatus"];
  rating: ProductItemEntity["rating"];
};
