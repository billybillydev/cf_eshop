import { z } from "zod";

type FetchApiRequest = string | Request | URL;

type FetchApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class FetchApi {
  baseUrl!: string;
  defaultOptions?: RequestInit;

  constructor(defaultParameters?: {
    baseUrl?: string;
    defaultOptions?: RequestInit;
  }) {
    if (defaultParameters?.baseUrl) {
      this.baseUrl = defaultParameters.baseUrl;
    }

    if (defaultParameters?.defaultOptions) {
      this.defaultOptions = defaultParameters.defaultOptions;
    }
  }

  async get<T>(
    url: FetchApiRequest,
    schema: z.ZodType<T>,
    options?: Omit<RequestInit, "body" | "method">
  ) {
    return this.configureFetchApi<T>("GET", url, schema, options);
  }

  async post<T>(
    url: FetchApiRequest,
    schema: z.ZodType<T>,
    options?: Omit<RequestInit, "method">
  ) {
    return this.configureFetchApi<T>("POST", url, schema, options);
  }

  async put<T>(
    url: FetchApiRequest,
    schema: z.ZodType<T>,
    options?: Omit<RequestInit, "method">
  ) {
    return this.configureFetchApi<T>("PUT", url, schema, options);
  }

  async patch<T>(
    url: FetchApiRequest,
    schema: z.ZodType<T>,
    options?: Omit<RequestInit, "method">
  ) {
    return this.configureFetchApi<T>("PATCH", url, schema, options);
  }

  async delete<T>(
    url: FetchApiRequest,
    schema: z.ZodType<T>,
    options?: Omit<RequestInit, "method">
  ) {
    return this.configureFetchApi<T>("DELETE", url, schema, options);
  }

  private async fetchApi<T>(
    url: FetchApiRequest,
    schema: z.ZodType<T>,
    init?: RequestInit
  ): Promise<T | void> {
    const response = await fetch(url, init);
    const data: unknown = await response.json();

    if (!response.ok) {
      throw new Error(response.statusText, { cause: data });
    }


    const parsedData = schema.safeParse(data);

    if (!parsedData.success) {
      throw new Error(parsedData.error.message);
    }

    return parsedData.data;
  }

  private configureFetchApi<T>(
    method: FetchApiMethod,
    url: FetchApiRequest,
    schema: z.ZodType<T>,
    options?: RequestInit
  ) {
    const path = this.setPath(url);
    const init = { ...this.defaultOptions, ...options };
    return this.fetchApi<T>(path, schema, { ...init, method });
  }

  private setPath(url: FetchApiRequest): FetchApiRequest {
    let fullPath;
    if (this.baseUrl && typeof url !== "string") {
      throw new Error("url parameter must be 'string' if baseUrl is defined");
    } else if (this.baseUrl && typeof url === "string") {
      if (url === "") {
        throw new Error("url cannot be an empty string");
      } else if (url === "/") {
        fullPath = this.baseUrl;
      } else {
        fullPath = `${this.baseUrl}${url}`;
      }
    } else {
      fullPath = url;
    }

    return fullPath;
  }
}
