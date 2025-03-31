import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from './env';

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    synchronize: true,
    autoLoadEntities: true,
    logging: env.isDev,
};