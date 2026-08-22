import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ItemVenda } from '../item-vendas/item-venda.entity';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome' })
  nome!: string;

  @Column({ name: 'descricao' })
  descricao?: string;

  @Column({ name: 'preco' })
  preco!: number;

  @Column({ name: 'quantidade_estoque' })
  quantidadeEstoque!: number;

  @OneToMany(() => ItemVenda, (itemVenda) => itemVenda.produto, { cascade: true })
  itemVendas?: ItemVenda[];

}
