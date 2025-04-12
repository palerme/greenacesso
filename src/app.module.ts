import { BoletosModule } from './boletos/boletos.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { typeormAsyncConfig } from './config/typeorm.config';
import { ImportacaoModule } from './importacao/importacao.module';

@Module({
  imports: [
    BoletosModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeormAsyncConfig),
    ImportacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
