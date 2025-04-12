import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PDFDocument } from 'pdf-lib';


import { Boleto } from '../boletos/boleto.entity';
import { Lote } from './lote.entity';


@Injectable()
export class ImportacaoService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepo: Repository<Boleto>,
    @InjectRepository(Lote)
    private readonly loteRepo: Repository<Lote>,
  ) {}

	async importarCSV(file: string): Promise<any> {
		const linhas: any[] = [];

		return new Promise((resolve, reject) => {
			fs.createReadStream(file)
				.pipe(csvParser({ separator: ';' }))
				.on('data', (row) => {
					linhas.push(row);
				})
				.on('end', async () => {
					try {
						const registros: Boleto[] = [];

						for (const row of linhas) {
							const nomeUnidadeCSV = row.unidade?.padStart(4, '0');
							const lote = await this.loteRepo.findOne({ where: { nome: nomeUnidadeCSV } });

							if (!lote) {
								console.warn(`⚠️ Lote com nome ${nomeUnidadeCSV} não encontrado. Linha ignorada.`);
								continue;
							}

							registros.push(
								this.boletoRepo.create({
									nomeSacado: row.nome,
									valor: parseFloat(row.valor),
									linha_digitavel: row.linha_digitavel,
									ativo: true,
									criado_em: new Date(),
									lote: { id: lote.id },
								}),
							);
						}

						if (registros.length > 0) {
							await this.boletoRepo.save(registros);
						}

						resolve({ total_boletos: registros.length });
					} catch (error) {
						reject(error);
					}
				})
				.on('error', reject);
		});
	}

	async extrairPaginasPDF(file: string): Promise<string[]> {
		const boletos = await this.boletoRepo.find({ order: { id: 'ASC' } });
		const arquivo = await fs.promises.readFile(file);
		const pdf = await PDFDocument.load(arquivo);
		const totalPages = pdf.getPageCount();

		if (boletos.length !== totalPages) {
			throw new Error(`Número de páginas (${totalPages}) diferente da quantidade de boletos (${boletos.length})`);
		}

		if (!process.env.FILE_UPLOAD_PATH) {
			throw new Error('A variável FILE_UPLOAD_PATH não está definida no .env');
		}

		const pastaSaida = path.join(process.env.FILE_UPLOAD_PATH ?? './uploads', 'boletos');
		await fs.promises.mkdir(pastaSaida, { recursive: true });

		const caminhos: string[] = [];

		for (let i = 0; i < boletos.length; i++) {
			const boleto = boletos[i];
			const novoPDF = await PDFDocument.create();
			const [pagina] = await novoPDF.copyPages(pdf, [i]);
			novoPDF.addPage(pagina);
			const bytes = await novoPDF.save();
			const boletoNome = boleto.nomeSacado
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9\-]/g, '');
			const nomeArquivo = `${i + 1}-${boletoNome}.pdf`;
			const caminhoFinal = path.join(pastaSaida, nomeArquivo);
			await fs.promises.writeFile(caminhoFinal, bytes);
			caminhos.push(caminhoFinal);
		}

		return caminhos;
	}


}
