import { config } from "$config";
import { AppBindings } from "$config/bindings";
import { categorySchema, Product, productSchema } from "$db/schemas";
import { D1DBRepository } from "$infrastructure/repositories/d1-db.repository";
import {
  CreateProductDTO,
  UpdateProductDTO,
} from "@eshop/business/domain/dtos";
import {
  InventoryStatus,
  ProductEntity,
  ProductItemEntity
} from "@eshop/business/domain/entities";
import { IdObject } from "@eshop/business/domain/value-objects";
import {
  ProductFilterParameters,
  ProductPaginationParameters,
  ProductRepositoryInterface,
} from "@eshop/business/infrastructure/ports";
import { and, eq, like, sql } from "drizzle-orm";
import { dash } from "radash";

export class ProductRepository extends D1DBRepository implements ProductRepositoryInterface {
  readonly defaultLimits = config.defaultLimits;
  readonly defaultPage = config.defaultPage;
  readonly lowStockThreshold = 10;
  
    constructor(bindingName: AppBindings["DB"]){
      super(bindingName)
    }

  async save(productData: CreateProductDTO): Promise<ProductEntity> {
    const quantity = productData.quantity ?? 0;
    const inventoryStatus = this.setInventoryStatus(quantity);

    const [resultWithId] = await this.db
      .insert(productSchema)
      .values(
        {
          ...productData,
          code: dash(productData.name),
          categoryId: productData.category.id,
          quantity,
          inventoryStatus,
        },
      ).returning({ id: productSchema.id });

    return this.getProductByIdOrFail(resultWithId, "Error creating product");
  }

  async showAll(): Promise<ProductItemEntity[]> {
    try {
      const res = await this.db.query.productSchema.findMany({
        with: { category: true },
      });

      return res.map(this.convertModelToItemEntity);;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getById(id: IdObject): Promise<ProductEntity | null> {
    try {
      const res = await this.db.query.productSchema.findFirst({
        where: (product, { eq }) => eq(product.id, id.value()),
        with: { category: true },
      });

      if (!res) {
        return null;
      }

      return this.convertModelToEntity(res);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getByCode(code: string): Promise<ProductEntity | null> {
    try {
      const res = await this.db.query.productSchema.findFirst({
        where: (product, { eq }) => eq(product.code, code),
        with: { category: true },
      });

      if (!res) {
        return null;
      }

      return this.convertModelToEntity(res);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  async update(id: IdObject, productData: UpdateProductDTO): Promise<ProductEntity> {
    const quantity = productData.quantity ?? 0;
    const inventoryStatus = this.setInventoryStatus(quantity);

    const [resultWithId] = await this.db
      .update(productSchema)
      .set({
        ...productData,
        code: productData.name ? dash(productData.name) : undefined,
        categoryId: productData.category?.id,
        quantity,
        inventoryStatus,
        updatedAt: Date.now()
      })
      .where(eq(productSchema.id, id.value()))
      .returning({ id: productSchema.id });

    return this.getProductByIdOrFail(resultWithId, "Error updating product");
  }
  async remove(id: IdObject): Promise<ProductEntity> {
    const productToDelete = await this.getProductByIdOrFail(
      { id: id.value() },
      "Error deleting product"
    );
    await this.db.delete(productSchema).where(eq(productSchema.id, id.value())).returning({ id: productSchema.id });

    return productToDelete;
  }

  filter?:
    | ((params: ProductFilterParameters) => Promise<ProductItemEntity[]>)
    | undefined;

  async paginate(
    params: ProductPaginationParameters
  ): Promise<[ProductItemEntity[], number]> {
    try {
      const filters = [];
      if (params.category) {
        filters.push(eq(categorySchema.name, params.category));
      }

      if (params.productName) {
        filters.push(like(productSchema.name, `%${params.productName}%`));
      }

      const limit = params.limit ?? this.defaultLimits[0];
      const offset = ((params.page ?? this.defaultPage) - 1) * limit;

      const [res, totalCount] = await Promise.all([
        this.db
          .select()
          .from(productSchema)
          .innerJoin(
            categorySchema,
            eq(productSchema.categoryId, categorySchema.id)
          )
          .where(and(...filters))
          .limit(limit)
          .offset(offset),
        this.db
          .select({ count: sql<number>`count(*)` })
          .from(productSchema)
          .innerJoin(
            categorySchema,
            eq(productSchema.categoryId, categorySchema.id)
          )
          .where(and(...filters)),
      ]);

      return [
        res.map((item) =>
          this.convertModelToItemEntity({
            ...item.products,
            category: item.categories,
          })
        ),
        totalCount.length ? totalCount[0].count : 0,
      ];
    } catch (error) {
      console.log(error);
      return [[], 0];
    }
  }

  private convertModelToEntity(product: Product): ProductEntity {
    return new ProductEntity({
      id: product.id,
      name: product.name,
      code: product.code,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      image: product.image,
      internalReference: product.internalReference,
      category: product.category,
      shellId: product.shellId,
      inventoryStatus: product.inventoryStatus as InventoryStatus,
      rating: product.rating,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  private convertModelToItemEntity(product: Product): ProductItemEntity {
    return new ProductItemEntity({
      id: product.id,
      name: product.name,
      code: product.code,
      price: product.price,
      image: product.image,
      category: product.category,
      internalReference: product.internalReference,
      shellId: product.shellId,
      inventoryStatus: product.inventoryStatus as InventoryStatus,
      rating: product.rating,
    });
  }

  private async getProductByIdOrFail(objectId: { id: number } | undefined, errorMessage: string): Promise<ProductEntity> {
    console.log({objectId});
    if (!objectId) {
      throw new Error(errorMessage);
    }

    const deletedProduct = await this.db.query.productSchema.findFirst({
      where: (product, { eq }) => eq(product.id, objectId.id),
      with: { category: true },
    });

    if (!deletedProduct) {
      throw new Error(errorMessage);
    }
    return this.convertModelToEntity(deletedProduct);
  }

  private setInventoryStatus(quantity: number): InventoryStatus {
    return quantity > 0
      ? quantity > this.lowStockThreshold
        ? "INSTOCK"
        : "LOWSTOCK"
      : "OUTOFSTOCK";
  }
}
