import { JwtVariables } from "hono/jwt";
import type { FavoriteRepositoryInterface } from "@eshop/business/infrastructure/ports";
import { SanitizedCustomerDTO } from "@eshop/business/domain/dtos";

export type AppVariables = JwtVariables<{ user: SanitizedCustomerDTO }> & {
  isAdmin: boolean;
  favoriteRepository: FavoriteRepositoryInterface;
};
