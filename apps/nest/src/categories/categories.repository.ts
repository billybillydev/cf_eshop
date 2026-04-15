import { CategoryEntity } from '@eshop/business/domain/entities';
import { IdObject } from '@eshop/business/domain/value-objects';
import { CategoryRepositoryInterface } from '@eshop/business/infrastructure/ports';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_DB } from 'src/db/db.constants';
import { DrizzleDb } from 'src/db/db.types';
import { categorySchema } from '../db/schemas/category.schema';

@Injectable()
export class CategoriesRepository implements CategoryRepositoryInterface {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async getAll(): Promise<CategoryEntity[]> {
    const categories = await this.db.select().from(categorySchema);

    return categories.map((category) => new CategoryEntity(category));
  }

  async getById(id: IdObject): Promise<CategoryEntity | null> {
    const category = await this.db.query.categorySchema.findFirst({
      where: eq(categorySchema.id, id.value()),
    });

    if (!category) {
      return null;
    }

    return new CategoryEntity(category);
  }
}
