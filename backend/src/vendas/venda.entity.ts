import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { ItemVenda } from '../item-vendas/item-venda.entity';

@Entity('vendas')
export class Venda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'data' })
  data!: Date;

  @Column({ name: 'valor_total' })
  valorTotal!: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente?: Cliente;

  @OneToMany(() => ItemVenda, (itemVenda) => itemVenda.venda, { cascade: true })
  itemVendas?: ItemVenda[];

}
