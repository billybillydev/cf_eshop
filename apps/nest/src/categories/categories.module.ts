import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';

@Module({
  imports: [DbModule],
  controllers: [CategoriesController],
  providers: [CategoriesRepository],
})
export class CategoriesModule {}
