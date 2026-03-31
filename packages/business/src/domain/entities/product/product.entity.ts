import { ProductDTO } from "$domain/dtos/product/product.dto";
import { CategoryEntity } from "$domain/entities/category.entity";
import { ProductItemEntity } from "$domain/entities/product/product-item.entity";
import { IdObject } from "$domain/value-objects/id.object-value";
import { PriceObject } from "$domain/value-objects/price.value-object";
import { dash } from "radash";

export type InventoryStatus = "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";

export class ProductEntity {
  readonly id: IdObject;
  #code: string;
  #name: string;
  description: string;
  category: CategoryEntity;
  image: string;
  price: PriceObject;
  internalReference: string;
  shellId: IdObject;
  #inventoryStatus: InventoryStatus = "OUTOFSTOCK";
  rating: number = 0;
  readonly createdAt: number = new Date().valueOf();
  updatedAt: number = new Date().valueOf();
  #quantity: number = 0;

  #lowStockThreshold = 10;

  constructor(dto: ProductDTO) {
    this.id = new IdObject(dto.id);
    this.#name = dto.name;
    this.#code = dto.code;
    this.description = dto.description;
    this.category = new CategoryEntity(dto.category);
    this.image = dto.image;
    this.price = new PriceObject(dto.price);
    this.internalReference = dto.internalReference;
    this.shellId = new IdObject(dto.shellId);
    if (dto.inventoryStatus) {
      this.#inventoryStatus = dto.inventoryStatus;
    }
    if (dto.createdAt) {
      this.createdAt = dto.createdAt;
    }
    if (dto.updatedAt) {
      this.updatedAt = dto.updatedAt;
    }
    if (dto.rating) {
      this.rating = dto.rating;
    }
    if (dto.quantity !== undefined && dto.quantity > -1) {
      this.#quantity = dto.quantity;
    }
    this.setInventoryStatus(this.#quantity);
  }

  get code() {
    return this.#code;
  }

  get name() {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
    this.#code = dash(value);
  }

  get quantity() {
    return this.#quantity;
  }
  
  set quantity(value: number) {
    this.#quantity = value < 0 ? 0 : value;
    this.setInventoryStatus(this.#quantity);
  }

  get inventoryStatus() {
    return this.#inventoryStatus;
  }

  transformToDTO(): ProductDTO {
    return {
      id: this.id.value(),
      name: this.#name,
      code: this.#code,
      description: this.description,
      image: this.image,
      quantity: this.#quantity,
      price: this.price.getValue(),
      category: this.category.transformToDTO(),
      internalReference: this.internalReference,
      shellId: this.shellId.value(),
      inventoryStatus: this.#inventoryStatus,
      rating: this.rating,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  transformToItemEntity(): ProductItemEntity {
    return new ProductItemEntity({
      id: this.id.value(),
      name: this.#name,
      code: this.#code,
      price: this.price.getValue(),
      image: this.image,
      category: this.category.transformToDTO(),
      internalReference: this.internalReference,
      shellId: this.shellId.value(),
      inventoryStatus: this.#inventoryStatus,
      rating: this.rating,
    });
  }

  private setInventoryStatus(quantity: number) {
    if (quantity === 0) {
      this.#inventoryStatus = "OUTOFSTOCK";
    } else if (quantity > 0 && quantity <= this.#lowStockThreshold) {
      this.#inventoryStatus = "LOWSTOCK";
    } else if (quantity > this.#lowStockThreshold) {
      this.#inventoryStatus = "INSTOCK";
    }
  }
}
