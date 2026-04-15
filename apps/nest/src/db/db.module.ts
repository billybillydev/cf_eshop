
import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/libsql';
import { DRIZZLE_DB } from './db.constants';
import { schema } from './schemas';

@Module({
  providers: [
    {
      provide: DRIZZLE_DB,
      useFactory: async () => {
        const { createClient } = await import('@libsql/client');
        const client = createClient({
          url: 'file:sqlite.db',
        });

        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DbModule {}
