import { drizzle } from 'drizzle-orm/libsql';
import { schema } from './schemas';

export type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;
