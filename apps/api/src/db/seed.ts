// import { env } from "$config";
// import { db } from "$db";
// import { categorySchema, InsertProduct, productSchema } from "$db/schemas";
// import { faker } from "@faker-js/faker";
// import { dash } from "radash";

// export class DatabaseSeeder {
//   private readonly categoryNames = [
//     "computers",
//     "kids",
//     "jewelery",
//     "shoes",
//     "garden",
//   ];

//   constructor(private readonly $db: typeof db) {
//     this.$db = db;
//   }

//   async seedDatabase() {
//     try {
//       console.log({seedingDB: env.SEEDING_DB});
//       if (env.SEEDING_DB) {
//         await this.$db.delete(productSchema);
//         await this.$db.delete(categorySchema);
  
//         console.log("\n\n              Seeding database...              \n\n");
//         await this.createProducts();
//         console.log("\n\n              Database seeded              \n\n");
//       }
//     } catch (error) {
//       console.log("Error during seeding\n", error, "\n==================\n");
//       process.exit(0);
//     }
//   }

//   private async createProducts() {
//     const categories = await this.createCategories();
//     console.log("\n================== categories seeded ==================\n");

//     const products: InsertProduct[] = [];

//     console.log("================== seeding products ==================");
//     for (let index = 0; index < 10 * this.categoryNames.length; index++) {
//       const randomCategory =
//         categories[
//           faker.number.int({ min: 0, max: this.categoryNames.length - 1 })
//         ];
//       const image = faker.image.urlLoremFlickr({
//         category: randomCategory.name,
//       });
//       const name = await this.findNonExistingProductName(products);
//       const quantity = faker.number.int({ min: 0, max: 100 });
//       const inventoryStatus =
//         quantity > 0
//           ? quantity > 10
//             ? "INSTOCK"
//             : "LOWSTOCK"
//           : "OUTOFSTOCK";

//       if (typeof name !== "string") {
//         throw new Error("Error in findNonExistingProductName");
//       }
//       const code = dash(name);

//       products.push({
//         name,
//         code,
//         description: faker.lorem.sentences({ min: 2, max: 5 }),
//         price: Number(faker.commerce.price({ min: 50, max: 5000 })),
//         categoryId: randomCategory.id,
//         quantity,
//         image,
//         internalReference:
//           faker.commerce.productAdjective() +
//           " " +
//           faker.commerce.productMaterial(),
//         shellId: faker.number.int({ min: 100, max: 999 }),
//         inventoryStatus,
//         rating: faker.number.int({ min: 0, max: 5 }),
//       });
//     }
//     await this.$db.insert(productSchema).values(products).run();
//     console.log("\n================== products seeded ==================\n");
//   }

//   private async createCategories() {
//     console.log("================== seeding categories ==================");
//     return this.$db
//       .insert(categorySchema)
//       .values(
//         this.categoryNames.map((name, index) => ({ id: index + 1, name }))
//       )
//       .returning();
//   }

//   private async findNonExistingProductName(
//     originalMockProducts: InsertProduct[]
//   ): Promise<string | Function> {
//     const name = faker.commerce.productName();

//     if (originalMockProducts.some((product) => product.name === name)) {
//       console.log(`${name} already exists, searching again a new name !`);
//       return this.findNonExistingProductName(originalMockProducts);
//     }

//     return name;
//   }
// }

// const seeder = new DatabaseSeeder(db);

// await seeder.seedDatabase();
