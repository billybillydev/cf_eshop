import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "$domain/dtos";
import {
  CategoryEntity,
  InventoryStatus,
  ProductEntity,
  ProductItemEntity,
} from "$domain/entities";
import { IdObject, PriceObject } from "$domain/value-objects";
import type {
  ProductRepositoryInterface,
  ProductFilterParameters,
  ProductPaginationParameters,
} from "$infrastructure/ports";
import { faker } from "@faker-js/faker";
import { dash } from "radash";

export class InMemoryProductRepository implements ProductRepositoryInterface {
  readonly categoryNames = ["computers", "kids", "jewelery", "shoes", "garden"];

  readonly products: ProductEntity[] = [
    "Modern Fresh Gloves",
    "Gorgeous Concrete Cheese",
    "Handmade Cotton Bike",
    "Practical Concrete Tuna",
    "Fantastic Bronze Chicken",
    "Small Bronze Chips",
    "Luxurious Soft Gloves",
    "Elegant Metal Chips",
    "Gorgeous Bronze Shirt",
    "Bespoke Steel Tuna",
    "Intelligent Concrete Computer",
    "Ergonomic Frozen Ball",
    "Rustic Wooden Shirt",
    "Gorgeous Concrete Sausages",
    "Recycled Bronze Tuna",
    "Practical Plastic Fish",
    "Tasty Plastic Chair",
    "Intelligent Metal Soap",
    "Ergonomic Rubber Gloves",
    "Elegant Bronze Keyboard",
  ].map(this.createFakeProductByName.bind(this));

  readonly defaultLimits = [4, 8, 16];
  readonly defaultPage = 1;
  readonly lowStockThreshold = 10;
  readonly maxQuantity = 100;

  async save(productData: CreateProductDTO): Promise<ProductEntity> {
    if (this.products.some((product) => product.name === productData.name)) {
      throw new Error("Product already exists");
    }
    const newProductEntity = new ProductEntity({
      ...productData,
      id: this.products.length + 1,
      code: dash(productData.name),
    });
    this.products.push(newProductEntity);

    return Promise.resolve(newProductEntity);
  }

  async showAll(): Promise<ProductItemEntity[]> {
    return Promise.resolve(
      this.products.map((product) => product.transformToItemEntity())
    );
  }

  async getById(id: IdObject): Promise<ProductEntity | null> {
    const existingProduct = this.products.find((product) =>
      product.id.equals(id)
    );

    return Promise.resolve(existingProduct ?? null);
  }

  async getByCode(code: string): Promise<ProductEntity | null> {
    const existingProduct = this.products.find(
      (product) => product.code === code
    );

    return Promise.resolve(existingProduct ?? null);
  }

  async update(
    id: IdObject,
    productData: UpdateProductDTO
  ): Promise<ProductEntity> {
    const existingProductIndex = this.products.findIndex((product) =>
      product.id.equals(id)
    );

    if (existingProductIndex < 0) {
      throw new Error("Product not found");
    }

    const updatedProductDTO: ProductDTO = {
      ...this.products[existingProductIndex].transformToDTO(),
      ...productData,
      updatedAt: Date.now(),
    };

    this.products[existingProductIndex] =
      new ProductEntity(updatedProductDTO);

    return Promise.resolve(this.products[existingProductIndex]);
  }

  async remove(id: IdObject): Promise<ProductEntity> {
    const existingProductIndex = this.products.findIndex((product) =>
      product.id.equals(id)
    );

    if (existingProductIndex < 0) {
      throw new Error("Product not found");
    }

    const deletedProduct = this.products[existingProductIndex];

    this.products.splice(existingProductIndex, 1);

    return Promise.resolve(deletedProduct);
  }

  async filter(params: ProductFilterParameters): Promise<ProductItemEntity[]> {
    let filteredProducts = this.products;

    if (params.category) {
      filteredProducts = this.filterByCategory(
        params.category,
        filteredProducts
      );
    }

    if (params.productName) {
      filteredProducts = this.filterByProductName(
        params.productName,
        filteredProducts
      );
    }

    return Promise.resolve(
      filteredProducts.map((product) => product.transformToItemEntity())
    );
  }

  async paginate({
    limit = this.defaultLimits[0],
    page = this.defaultPage,
    ...filters
  }: ProductPaginationParameters): Promise<[ProductItemEntity[], number]> {
    let products = this.products.map((product) =>
      product.transformToItemEntity()
    );

    if (filters) {
      products = await this.filter(filters);
    }

    if (!this.defaultLimits.includes(limit)) {
      limit = this.defaultLimits[0];
    }

    if (page < this.defaultPage) {
      page = this.defaultPage;
    }

    return Promise.resolve([
      products.slice((page - 1) * limit, page * limit),
      products.length,
    ]);
  }

  private filterByCategory(
    categoryValue: CategoryEntity["name"],
    products: ProductEntity[]
  ): ProductEntity[] {
    return products.filter(
      (product) => product.category.name === categoryValue
    );
  }

  private filterByProductName(
    productNameValue: ProductEntity["name"],
    products: ProductEntity[]
  ): ProductEntity[] {
    return products.filter((product) =>
      product.name.toLowerCase().includes(productNameValue.toLowerCase())
    );
  }
  private createFakeProductByName(name: string, index: number): ProductEntity {
    const code = dash(name);
    const category = faker.helpers.arrayElement(this.categoryNames);
    const image = faker.image.urlLoremFlickr({ category });
    const quantity = faker.number.int({ min: 0, max: this.maxQuantity });
    const inventoryStatus: InventoryStatus =
      quantity === 0
        ? "OUTOFSTOCK"
        : quantity > this.lowStockThreshold
          ? "INSTOCK"
          : "LOWSTOCK";

    return new ProductEntity({
      id: index + 1,
      name,
      code,
      description: faker.lorem.sentences({ min: 2, max: 5 }),
      price: Number(faker.commerce.price({ min: 50, max: 5000 })),
      category: {
        id: faker.number.int({ min: 1, max: this.categoryNames.length - 1 }),
        name: category,
      },
      quantity,
      image,
      internalReference:
        faker.commerce.productAdjective() +
        " " +
        faker.commerce.productMaterial(),
      shellId: faker.number.int({ min: 100, max: 999 }),
      inventoryStatus,
      rating: faker.number.int({ min: 0, max: 5 }),
      createdAt: faker.date.past().getTime(),
      updatedAt: faker.date.past().getTime(),
    });
  }
}
