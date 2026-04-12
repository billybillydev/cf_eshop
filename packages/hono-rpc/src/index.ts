import { hc, type ClientRequestOptions } from "hono/client";
import type { ApiRoutes } from "@eshop/api/types";

export function honoClientRPC(url: string, options?: ClientRequestOptions) {
  return hc<ApiRoutes>(url, options);
}
