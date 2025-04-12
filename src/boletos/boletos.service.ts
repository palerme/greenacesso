import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike } from 'typeorm';

import { Boleto } from './boleto.entity';
import * as stream from 'stream';

const PDFDocument = require('pdfkit');


@Injectable()
export class BoletosService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepo: Repository<Boleto>,
  ) {}

  async buscarTodos(filtros: {
    nome?: string;
    valorInicial?: number;
    valorFinal?: number;
    idLote?: number;
    relatorio?: boolean;
  }) {
    const where: any = {};
    if (filtros.nome) {
      where.nomeSacado = ILike(`%${filtros.nome}%`);
    }
    if (filtros.valorInicial !== undefined && filtros.valorFinal !== undefined) {
      where.valor = Between(filtros.valorInicial, filtros.valorFinal);
    } else if (filtros.valorInicial !== undefined) {
      where.valor = Between(filtros.valorInicial, Number.MAX_SAFE_INTEGER);
    } else if (filtros.valorFinal !== undefined) {
      where.valor = Between(0, filtros.valorFinal);
    }
    if (filtros.idLote !== undefined) {
      where.lote = { id: filtros.idLote };
    }
    const boletos = await this.boletoRepo.find({
      where,
      relations: ['lote'],
      order: { id: 'ASC' },
    });
    if (filtros.relatorio) {
      return this.gerarRelatorioPDF(boletos);
    }
    return boletos;
  }


  async gerarRelatorioPDF(boletos: Boleto[]): Promise<{ base64: string }> {
    const doc = new PDFDocument({ margin: 30 });
    const buffer: Buffer[] = [];

    const writeStream = new stream.Writable({
      write(chunk, _, callback) {
        buffer.push(chunk);
        callback();
      },
    });

    doc.pipe(writeStream);
    doc.fontSize(18).text('Relatório de Boletos', { align: 'center' }).moveDown(1.5);

    // Cabeçalhos
    let y = doc.y;
    doc.fontSize(10);
    doc.text('ID', 40, y);
    doc.text('Nome do Sacado', 80, y);
    doc.text('ID Lote', 250, y);
    doc.text('Valor', 310, y);
    doc.text('Linha Digitável', 370, y);

    y += 20; // pular uma linha após os cabeçalhos

    // Conteúdo dos boletos
    boletos.forEach((boleto) => {
      const valor = typeof boleto.valor === 'number' ? boleto.valor : parseFloat(boleto.valor);

      doc.text(String(boleto.id), 40, y);
      doc.text(boleto.nomeSacado, 80, y);
      doc.text(String(boleto.lote?.id), 250, y);
      doc.text(valor.toFixed(2), 310, y);
      doc.text(boleto.linha_digitavel, 370, y);

      y += 20; // próxima linha
    });


    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        const fullBuffer = Buffer.concat(buffer);
        resolve({ base64: fullBuffer.toString('base64') });
      });
      writeStream.on('error', reject);
    });
  }

}
