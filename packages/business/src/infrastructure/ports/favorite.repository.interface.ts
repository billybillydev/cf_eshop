import { FavoriteVO, IdObject } from "$domain/value-objects";

export type ResultResponse = {
  success: true;
} | {
  success: false;
  message: string;
};

export interface FavoriteRepositoryInterface {
  getAllByCustomerId(customerId: IdObject): Promise<Array<FavoriteVO>>;
  add(
    customerId: IdObject,
    favorite: FavoriteVO
  ): Promise<ResultResponse>;
  remove(
    customerId: IdObject,
    productId: IdObject
  ): Promise<ResultResponse>;
}