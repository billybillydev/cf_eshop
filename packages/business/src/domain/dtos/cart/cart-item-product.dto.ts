import { ProductDTO } from "$domain/dtos/product";

export type CartItemProductDTO = {
  id: ProductDTO["id"];
  name: ProductDTO["name"];
  code: ProductDTO["code"];
  image: ProductDTO["image"];
  price: ProductDTO["price"];
  category: ProductDTO["category"];
  inventoryStatus: ProductDTO["inventoryStatus"];
};
