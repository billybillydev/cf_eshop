import { AddCustomerFavoriteDTO } from "$domain/dtos/customer/add-customer-favorites.dto";
import { CustomerFavoriteDTO } from "$domain/dtos/customer/customer-favorite.dto";
import { IdObject } from "$domain/value-objects/id.object-value";
import { Dat } from "@mosidev/dat";

export class FavoriteVO {
  public readonly productId: IdObject;
  public readonly productCode: string;
  public readonly productName: string;
  public readonly productImage: string;
  public readonly inventoryStatus: string;
  public readonly createdAt: number;

  constructor(data: AddCustomerFavoriteDTO) {
    this.productId = new IdObject(data.productId);
    this.productCode = data.productCode;
    this.productName = data.productName;
    this.productImage = data.productImage;
    this.inventoryStatus = data.inventoryStatus;
    this.createdAt = data.createdAt ?? Dat.now();
  }

  transformToDTO(): CustomerFavoriteDTO {
    return {
      productId: this.productId.value(),
      productCode: this.productCode,
      productName: this.productName,
      productImage: this.productImage,
      inventoryStatus: this.inventoryStatus,
      createdAt: this.createdAt,
    };
  }
}
