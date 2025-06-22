import { CategoryEntity } from "$domain/entities";
import { ShowProductsUseCase } from "$domain/usecases/product";
import { IdObject } from "$domain/value-objects";
import {
  InMemoryProductRepository,
} from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let productRepository: InMemoryProductRepository;

beforeEach(() => {
  productRepository = new InMemoryProductRepository();
});

describe("ShowProductsUseCase without paginate and/or filter parameters", () => {
  it("should return all products", async () => {
    const showProductsUseCase = new ShowProductsUseCase(productRepository);
    const products = await showProductsUseCase.execute();

    expect(Array.isArray(products)).toBeTruthy();
  });
});

describe("ShowProductsUseCase with filters parameters", () => {
  it("should filter products by category and return empty product list for selected category", async () => {
    const nonExistedCategoryInProduct = new CategoryEntity({
      id: new IdObject(73),
      name: "does not exist",
    });
    const filterProductsUseCase = new ShowProductsUseCase(productRepository);
    const [filteredProducts] = await filterProductsUseCase.execute({
      category: nonExistedCategoryInProduct.name,
    });

    expect(Array.isArray(filteredProducts)).toBeTruthy();
    expect(filteredProducts.length).toBe(0);
  });

  it("should filter products by category and only return products with selected category", async () => {
    const category = new CategoryEntity({
      id: new IdObject(1),
      name: "computers",
    });
    const filterProductsUseCase = new ShowProductsUseCase(productRepository);
    const [filteredProducts] = await filterProductsUseCase.execute({
      category: category.name,
    });

    expect(Array.isArray(filteredProducts)).toBeTruthy();
    expect(
      filteredProducts.every(
        (product) => product.category.name === category.name
      )
    ).toBeTruthy();
  });

  it("should filter products by product name and return empty product list", async () => {
    const nonExistedProductName = "abcd";
    const filterProductsUseCase = new ShowProductsUseCase(productRepository);
    const [filteredProducts] = await filterProductsUseCase.execute({
      productName: nonExistedProductName,
    });

    expect(Array.isArray(filteredProducts)).toBeTruthy();
    expect(filteredProducts.length).toBe(0);
  });

  it("should filter products by product name and return product list", async () => {
    const existedProductName = "Gorgeous";
    const filterProductsUseCase = new ShowProductsUseCase(productRepository);
    const [filteredProducts] = await filterProductsUseCase.execute({
      productName: existedProductName,
    });

    expect(Array.isArray(filteredProducts)).toBeTruthy();
    expect(
      filteredProducts.every((product) =>
        product.name.toLowerCase().includes(existedProductName.toLowerCase())
      )
    ).toBeTruthy();
  });

  it("should filter products by product name with case insensitive and return product list", async () => {
    const existedProductName = "gorgeous";
    const filterProductsUseCase = new ShowProductsUseCase(productRepository);
    const [filteredProducts] = await filterProductsUseCase.execute({
      productName: existedProductName,
    });

    expect(Array.isArray(filteredProducts)).toBeTruthy();
    expect(
      filteredProducts.every((product) =>
        product.name.toLowerCase().includes(existedProductName.toLowerCase())
      )
    ).toBeTruthy();
  });
});

describe("ShowProductsUseCase with paginate and filter parameters", () => {
  it("should paginate product list with limit and page", async () => {
    const limit = 4;
    const page = 2;

    const paginateProductsUseCase = new ShowProductsUseCase(
      productRepository
    );
    const [filteredProducts] = await paginateProductsUseCase.execute({
      limit,
      page,
    });

    expect(Array.isArray(filteredProducts)).toBeTruthy();
    expect(filteredProducts.length).toBeLessThanOrEqual(limit);
  });

  it("should paginate product list with limit and first page if page is lesser than first page", async () => {
    const limit = 8;
    const page = -2;

    const paginateProductsUseCase = new ShowProductsUseCase(
      productRepository
    );
    const [filteredProducts] = await paginateProductsUseCase.execute({
      limit,
      page,
    });

    expect(Array.isArray(filteredProducts)).toBeTruthy();
    expect(filteredProducts.length).toBeLessThanOrEqual(limit);
  });

  it("should paginate empty product list with limit and page if page is greater than last page", async () => {
    const products = await productRepository.showAll();
    const limit = 8;
    const nbPages = Math.ceil(products.length / limit);
    const page = nbPages + 2;

    const paginateProductsUseCase = new ShowProductsUseCase(
      productRepository
    );
    const [filteredProducts] = await paginateProductsUseCase.execute({
      limit,
      page,
    });

    expect(Array.isArray(filteredProducts)).toBeTruthy();
    expect(filteredProducts.length).toBeLessThanOrEqual(limit);
  });

  it("should paginate first default limits product list with limit and page if limit is not included in default limits", async () => {
    const limit = 0;
    const page = 2;

    const paginateProductsUseCase = new ShowProductsUseCase(
      productRepository
    );
    const [filteredProducts] = await paginateProductsUseCase.execute({
      limit,
      page,
    });

    expect(Array.isArray(filteredProducts)).toBeTruthy();
    expect(filteredProducts.length).toBeLessThanOrEqual(
      productRepository.defaultLimits[0]
    );
  });

  it("should paginate limits product list with limit, page and productName", async () => {
    const limit = 4;
    const page = 2;
    const productName = "fr";

    const paginateProductsUseCase = new ShowProductsUseCase(
      productRepository
    );
    const [filteredProducts] = await paginateProductsUseCase.execute({
      limit,
      page,
      productName,
    });

    expect(Array.isArray(filteredProducts)).toBeTruthy();
    expect(filteredProducts.length).toBeLessThanOrEqual(limit);
    expect(
      filteredProducts.every((product) => product.name.includes(productName))
    ).toBeTruthy();
  });
});
