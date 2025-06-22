import { CreateProductDTO } from "$domain/dtos";
import { CreateProductUseCase } from "$domain/usecases/product";
import { InMemoryProductRepository } from "$infrastructure/adapters/in-memory";
import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "@jest/globals";

let productRepository: InMemoryProductRepository;

beforeEach(() => {
  productRepository = new InMemoryProductRepository();
});

describe("CreateProductUseCase", () => {
  it("should throw an error if product exists", async () => {
    const name = productRepository.products[0].name;
    const indexCategory = faker.number.int({
      min: 1,
      max: productRepository.categoryNames.length - 1,
    });
    const category = productRepository.categoryNames[indexCategory];
    const image = faker.image.urlLoremFlickr({ category });
    const quantity = faker.number.int({ min: 0, max: 100 });

    const existingProductDTO: CreateProductDTO = {
      name,
      description: faker.lorem.sentences({ min: 2, max: 5 }),
      price: Number(faker.commerce.price({ min: 50, max: 5000 })),
      category: { id: indexCategory, name: category },
      quantity,
      image,
      internalReference:
        faker.commerce.productAdjective() +
        " " +
        faker.commerce.productMaterial(),
      shellId: faker.number.int({ min: 100, max: 999 }),
    };

    const createProductUseCase = new CreateProductUseCase(productRepository);

    expect(createProductUseCase.execute(existingProductDTO)).rejects.toThrow(
      "Product already exists"
    );
  });

  it("should create a new product", async () => {
    const name = faker.commerce.productName();
    const indexCategory = faker.number.int({
      min: 1,
      max: productRepository.categoryNames.length - 1,
    });
    const category = productRepository.categoryNames[indexCategory];
    const image = faker.image.urlLoremFlickr({ category });

    const createProductDTO: CreateProductDTO = {
      name,
      description: faker.lorem.sentences({ min: 2, max: 5 }),
      price: Number(faker.commerce.price({ min: 50, max: 5000 })),
      category: {
        id: indexCategory,
        name: category,
      },
      quantity: faker.number.int({ min: 0, max: 100 }),
      image,
      internalReference:
        faker.commerce.productAdjective() +
        " " +
        faker.commerce.productMaterial(),
      shellId: faker.number.int({ min: 100, max: 999 }),
    };

    const createProductUseCase = new CreateProductUseCase(productRepository);

    const newProduct = await createProductUseCase.execute(createProductDTO);

    expect(newProduct.name).toEqual(name);
  });
});
