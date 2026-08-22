import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venda } from '../vendas/venda.entity';
import { Produto } from '../produtos/produto.entity';

@Entity('item_vendas')
export class ItemVenda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quantidade' })
  quantidade!: number;

  @Column({ name: 'preco_unitario' })
  precoUnitario!: number;

  @ManyToOne(() => Venda, { eager: true })
  @JoinColumn({ name: 'venda_id' })
  venda!: Venda;

  @ManyToOne(() => Produto, { eager: true })
  @JoinColumn({ name: 'produto_id' })
  produto!: Produto;

}
