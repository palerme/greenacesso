import { Controller, Get, Query } from '@nestjs/common';
import { BoletosService } from './boletos.service';

@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

	@Get()
	async listar(
		@Query('nome') nome?: string,
		@Query('valor_inicial') valorInicial?: string,
		@Query('valor_final') valorFinal?: string,
		@Query('id_lote') idLote?: string,
		@Query('relatorio') relatorio?: string,
	) {
		return this.boletosService.buscarTodos({
			nome,
			valorInicial: valorInicial ? parseFloat(valorInicial) : undefined,
			valorFinal: valorFinal ? parseFloat(valorFinal) : undefined,
			idLote: idLote ? parseInt(idLote) : undefined,
			relatorio: relatorio === '1',
		});
	}
}
