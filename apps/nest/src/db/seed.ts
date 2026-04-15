import { drizzle } from 'drizzle-orm/libsql';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { schema } from './schemas';
import { categorySchema } from './schemas/category.schema';

type CsvCategoryRow = {
  id: number;
  name: string;
};

const parseCsv = (content: string): CsvCategoryRow[] => {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const [, ...rows] = lines;

  return rows.map((row) => {
    const [id, name] = row
      .split(',')
      .map((value) => value.trim().replace(/^"|"$/g, ''));

    return {
      id: Number(id),
      name,
    };
  });
};

const seed = async () => {
  const csvPath = resolve(process.cwd(), '../../data/categories.csv');
  const csvContent = await readFile(csvPath, 'utf-8');
  const categories = parseCsv(csvContent);

  const { createClient } = await import('@libsql/client');
  const client = createClient({
    url: 'file:sqlite.db',
  });

  const db = drizzle(client, { schema });

  await db.delete(categorySchema);

  if (categories.length > 0) {
    await db.insert(categorySchema).values(categories);
  }

  console.log(`Seeded ${categories.length} categories from ${csvPath}`);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
