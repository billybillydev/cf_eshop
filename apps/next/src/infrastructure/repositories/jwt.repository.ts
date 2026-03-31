import { FetchApi } from "@eshop/application";

export class JwtRepository {
  constructor(protected api: FetchApi) {}

  setToken(token: string): void {
    this.api.defaultOptions = {
      ...this.api.defaultOptions,
      headers: {
        ...this.api.defaultOptions?.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
