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

  constructor(productData: {
    id: IdObject;
    name: string;
    code: string;
    description: string;
    category: CategoryEntity;
    image: string;
    price: PriceObject;
    internalReference: string;
    shellId: IdObject;
    inventoryStatus?: InventoryStatus;
    rating?: number;
    createdAt?: number;
    updatedAt?: number;
    quantity?: number;
  }) {
    this.id = productData.id;
    this.#name = productData.name;
    this.#code = productData.code;
    this.description = productData.description;
    this.category = productData.category;
    this.image = productData.image;
    this.price = productData.price;
    this.internalReference = productData.internalReference;
    this.shellId = productData.shellId;
    if (productData.inventoryStatus) {
      this.#inventoryStatus = productData.inventoryStatus;
    }
    if (productData.createdAt) {
      this.createdAt = productData.createdAt;
    }
    if (productData.updatedAt) {
      this.updatedAt = productData.updatedAt;
    }
    if (productData.rating) {
      this.rating = productData.rating;
    }
    if (productData.quantity !== undefined && productData.quantity > -1) {
      this.#quantity = productData.quantity;
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
      id: this.id,
      name: this.#name,
      code: this.#code,
      price: this.price,
      image: this.image,
      category: this.category,
      internalReference: this.internalReference,
      shellId: this.shellId,
      inventoryStatus: this.#inventoryStatus,
      rating: this.rating,
    });
  }

  static transformToEntity(
    product: ProductDTO
  ): ProductEntity {
    return new ProductEntity({
      ...product,
      id: new IdObject(product.id),
      price: new PriceObject(product.price),
      shellId: new IdObject(product.shellId),
      category: CategoryEntity.transformToEntity(product.category),
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
