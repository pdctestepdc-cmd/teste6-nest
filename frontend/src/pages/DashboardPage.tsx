import { Hero, ResourceOverview, PageBreadcrumb } from "../components";
import { produtosService } from "../services/produtos.service";
import { clientesService } from "../services/clientes.service";
import { vendasService } from "../services/vendas.service";
import { itemVendasService } from "../services/itemvendas.service";

export default function DashboardPage() {

  return (
    <div className="page">

      <PageBreadcrumb items={[{ label: `Visão Geral da Padaria` }]} />

      <Hero title={`Bem-vindo ao Sistema de Padaria`} subtitle={`Gerencie produtos, vendas e clientes de forma eficiente!`} />
      <ResourceOverview resources={[{ label: "Produtos", to: "/produtos", load: produtosService.list }, { label: "Clientes", to: "/clientes", load: clientesService.list }, { label: "Vendas", to: "/vendas", load: vendasService.list }, { label: "Itens de Venda", to: "/itemVendas", load: itemVendasService.list }]} />
    </div>
  );
}
