/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boleto } from './boleto.entity';
import { BoletosController } from './boletos.controller';
import { BoletosService } from './boletos.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Boleto])
    ],
    controllers: [BoletosController],
    providers: [BoletosService],
    exports: [TypeOrmModule]
})
export class BoletosModule {}
