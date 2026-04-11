import { CustomerFavoriteDTO } from "$domain/dtos/customer/customer-favorite.dto";

export type AddCustomerFavoriteDTO = {
  productId: CustomerFavoriteDTO["productId"];
  productName: CustomerFavoriteDTO["productName"];
  productImage: CustomerFavoriteDTO["productImage"];
  inventoryStatus: CustomerFavoriteDTO["inventoryStatus"];
  createdAt?: CustomerFavoriteDTO["createdAt"];
};
