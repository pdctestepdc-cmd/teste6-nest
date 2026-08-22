import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Venda } from '../vendas/venda.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome' })
  nome!: string;

  @Column({ name: 'telefone' })
  telefone?: string;

  @OneToMany(() => Venda, (venda) => venda.cliente, { cascade: true })
  vendas?: Venda[];

}
