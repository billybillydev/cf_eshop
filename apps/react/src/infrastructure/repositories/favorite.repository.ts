import { IdObject, FavoriteVO } from "@eshop/business/domain/value-objects";
import {
  FavoriteRepositoryInterface,
  ResultResponse,
} from "@eshop/business/infrastructure/ports";
import { honoClientRPC } from "@eshop/hono-rpc";

export class FavoriteRepository implements FavoriteRepositoryInterface {
  private readonly clientRpc: ReturnType<typeof honoClientRPC>;

  constructor(params: { apiUrl: string; token?: string }) {
    if (!params.apiUrl) {
      throw new Error("API_URL is not defined");
    }
    this.clientRpc = honoClientRPC(params.apiUrl);
    
  }

  async getAllByCustomerId(customerId: IdObject): Promise<Array<FavoriteVO>> {
    const response = await this.clientRpc.favorites.$get();
    const data = await response.json();
    return data.map((item) => new FavoriteVO(item));
  }

  async add(customerId: IdObject, favorite: FavoriteVO): Promise<ResultResponse> {
    const res = await this.clientRpc.favorites.$post({
      json: {
        productId: favorite.productId.value()
      }
    });
    
    if (!res.ok) {
      const json = await res.json();
      return { message: json.error, success: false };
    }

    const json = await res.json();
    return json;
  }

  async remove(customerId: IdObject, productId: IdObject): Promise<ResultResponse> {
    const res = await this.clientRpc.favorites.$delete({
      query: {
        productId: String(productId.value())
      }
    });
    
    if (!res.ok) {
      const json = await res.json();
      return { message: json.error, success: false };
    }

    const json = await res.json();
    return json;
  }
}
