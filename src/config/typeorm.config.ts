import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

export const typeormAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => {
    const entitiesPath = [join(__dirname, '/../**/*.entity{.ts,.js}')];

		return {
      type: 'postgres',
      host: config.get<string>('TYPEORM_HOST'),
      port: +config.get<number>('TYPEORM_PORT') || 5432,
      username: config.get<string>('TYPEORM_USERNAME'),
      password: config.get<string>('TYPEORM_PASSWORD'),
      database: config.get<string>('TYPEORM_DATABASE'),
      entities: entitiesPath,
      synchronize: false,
      // logging: true,
      // logger: 'advanced-console',
    };
  },
  inject: [ConfigService],
};
