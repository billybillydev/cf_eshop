import { CustomerFavoriteDTO } from "$domain/dtos/customer/customer-favorite.dto";

export type AddCustomerFavoriteDTO = {
  productId: CustomerFavoriteDTO["productId"];
  productCode: CustomerFavoriteDTO["productCode"];
  productName: CustomerFavoriteDTO["productName"];
  productImage: CustomerFavoriteDTO["productImage"];
  inventoryStatus: CustomerFavoriteDTO["inventoryStatus"];
  createdAt?: CustomerFavoriteDTO["createdAt"];
};
