import { Lote } from "src/importacao/lote.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";


@Entity('boletos')
export class Boleto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome_sacado', type: 'varchar', length: 255 })
  nomeSacado: string;

  @Column('decimal')
  valor: number;

  @Column({ type: 'varchar', length: 255 })
  linha_digitavel: string;

  @Column()
  ativo: boolean;

  @Column({ type: 'timestamp' })
  criado_em: Date;

  @ManyToOne(() => Lote)
  @JoinColumn({ name: 'id_lote' })
  lote: Lote;
}
