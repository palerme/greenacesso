import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('lotes')
export class Lote {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'boolean' })
  ativo: boolean;

  @Column({ type: 'timestamp' })
  criado_em: Date;
}