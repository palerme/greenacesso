import { Module } from '@nestjs/common';
import { ImportacaoController } from './importacao.controller';
import { ImportacaoService } from './importacao.service';
import { BoletosModule } from 'src/boletos/boletos.module';
import { Lote } from './lote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    BoletosModule,
    TypeOrmModule.forFeature([Lote]),
  ],
  controllers: [ImportacaoController],
  providers: [ImportacaoService],
  exports: [TypeOrmModule],
})
export class ImportacaoModule {}
