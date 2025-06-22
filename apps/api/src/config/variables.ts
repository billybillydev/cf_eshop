import { JwtVariables } from "hono/jwt";

export type AppVariables = JwtVariables & {
    isAdmin: boolean;
}