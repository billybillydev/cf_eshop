import { JwtRepository } from "$/infrastructure/repositories/jwt.repository";
import { FetchApi } from "@eshop/application";
import {
  CreateProductDTO,
  ProductDTO,
  ProductItemDTO,
  UpdateProductDTO,
} from "@eshop/business/domain/dtos";
import {
  ProductEntity,
  ProductItemEntity,
} from "@eshop/business/domain/entities";
import { IdObject } from "@eshop/business/domain/value-objects";
import {
  ProductFilterParameters,
  ProductPaginationParameters,
  ProductRepositoryInterface,
} from "@eshop/business/infrastructure/ports";
import qs from "qs";
import { z } from "zod";

export class ProductRepository extends JwtRepository implements ProductRepositoryInterface {
  readonly #api: FetchApi;
  readonly #productItemDTOSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    code: z.string(),
    category: z.object({
      id: z.number(),
      name: z.string(),
    }),
    internalReference: z.string(),
    shellId: z.number(),
    image: z.string(),
    inventoryStatus: z.enum(["INSTOCK", "LOWSTOCK", "OUTOFSTOCK"]),
    rating: z.number(),
  });
  readonly #productDTOSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    code: z.string(),
    category: z.object({
      id: z.number(),
      name: z.string(),
    }),
    internalReference: z.string(),
    shellId: z.number(),
    image: z.string(),
    inventoryStatus: z.enum(["INSTOCK", "LOWSTOCK", "OUTOFSTOCK"]),
    rating: z.number(),
    quantity: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
  });

  constructor() {
    const api = new FetchApi({
      defaultOptions: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    });
    super(api);
    this.#api = api;
  }
  
  save(productData: CreateProductDTO): Promise<ProductEntity> {
    throw new Error("Method not implemented.");
  }

  async showAll(): Promise<ProductItemEntity[]> {
    try {
      const res = await this.#api.get<ProductItemDTO[]>(
        `/api/products`,
        z.array(this.#productItemDTOSchema)
      );

      if (!res) {
        throw new Error("Error");
      }

      return res.map(product => new ProductItemEntity(product));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getById(id: IdObject): Promise<ProductEntity | null> {
    try {
      const res = await this.#api.get<ProductDTO>(
        `/api/products/${id.value()}`,
        this.#productDTOSchema
      );
      return res ? new ProductEntity(res) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getByCode(code: string): Promise<ProductEntity | null> {
    try {
      const res = await this.#api.get<ProductDTO>(
        `/api/products/code/${code}`,
        this.#productDTOSchema
      );
      return res ? new ProductEntity(res) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  update(id: IdObject, productData: UpdateProductDTO): Promise<ProductEntity> {
    throw new Error("Method not implemented.");
  }
  remove(id: IdObject): Promise<ProductEntity> {
    throw new Error("Method not implemented.");
  }

  async filter(params: ProductFilterParameters): Promise<ProductItemEntity[]> {
    const searchParams = new URLSearchParams(params);
    const products = await this.#api.get<ProductItemDTO[]>(
      "/api/products?" + searchParams.toString(),
      z.array(this.#productItemDTOSchema)
    );

    if (!products) {
      throw new Error("Error");
    }
    return products.map(product => new ProductItemEntity(product));
  }

  async paginate(
    params: ProductPaginationParameters
  ): Promise<[ProductItemEntity[], number]> {
    const searchParams = qs.stringify(params);
    const res = await this.#api.get<[ProductItemDTO[], number]>(
      "/api/products/paginate?" + searchParams,
      z.tuple([z.array(this.#productItemDTOSchema), z.number()])
    );

    if (!res) {
      throw new Error("Error");
    }

    const [products, total] = res;

    return [
      products.map(product => new ProductItemEntity(product)),
      total,
    ];
  }
}
