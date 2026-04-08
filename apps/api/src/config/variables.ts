import { JwtVariables } from "hono/jwt";
import type { FavoriteRepositoryInterface } from "@eshop/business/infrastructure/ports";

export type AppVariables = JwtVariables & {
    isAdmin: boolean;
    favoriteRepository: FavoriteRepositoryInterface;
}