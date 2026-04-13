import { JwtRepository } from "$/infrastructure/repositories/jwt.repository";
import { FetchApi } from "@eshop/application";
import { CategoryDTO } from "@eshop/business/domain/dtos";
import { CategoryEntity } from "@eshop/business/domain/entities";
import { IdObject } from "@eshop/business/domain/value-objects";
import { CategoryRepositoryInterface } from "@eshop/business/infrastructure/ports";
import z from "zod";


export class CategoryRepository
  extends JwtRepository
  implements CategoryRepositoryInterface
{
  readonly #api: FetchApi;
  readonly #categoryDTOSchema = z.object({
    id: z.number(),
    name: z.string(),
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

  async getAll(): Promise<CategoryEntity[]> {
    try {
      const categories = await this.#api.get<CategoryDTO[]>(
        "/api/categories",
        z.array(this.#categoryDTOSchema)
      );
  
      if (!categories) {
        throw new Error("Error");
      }
      return categories.map(category => new CategoryEntity(category));
    } catch (error) {
      console.log({ error });
      return Promise.resolve([])
    }
  }

  getById(id: IdObject): Promise<CategoryEntity | null> {
    throw new Error("Method not implemented.");
  }
}