import { DataTable, ApiForm, PageBreadcrumb } from "../components";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { itemVendasService } from "../services/itemvendas.service";
import { vendasService } from "../services/vendas.service";
import { produtosService } from "../services/produtos.service";

export default function ItemVendasPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const closeCreateDialog = () => setCreateOpen(false);


  return (
    <div className="page">

      <PageBreadcrumb items={[{ label: `Listagem de ItemVendas` }]} />

      <header className="page-header">
        <div>
          <h1 className="page-title">{`Listagem de ItemVendas`}</h1>
        </div>
      </header>
      <p style={{ margin: "-18px 0 20px 0" }}>{`Gerencie itemvendas cadastrados, revise status e execute ações recorrentes.`}</p>
      <div className="page-actions">
        <button className="btn btn-primary" type="button" onClick={() => setCreateOpen(true)}>
          <Plus size={16} aria-hidden="true" />
          Adicionar
        </button>
      </div>
      <DataTable load={itemVendasService.list} reloadToken={reloadToken} columns={[{"key":"quantidade","label":"Quantidade"},{"key":"precoUnitario","label":"Preço Unitário"},{"key":"vendaId","label":"Venda"},{"key":"produtoId","label":"Produto"}]} idKey={"id"} fields={[{"name":"quantidade","label":"Quantidade","type":"number","required":true,"readOnly":false},{"name":"precoUnitario","label":"Preço Unitário","type":"number","required":true,"readOnly":false},{"name":"vendaId","label":"Venda","type":"number","required":true,"readOnly":false,"relation":{"endpoint":"/api/vendas","valueKey":"id"}},{"name":"produtoId","label":"Produto","type":"number","required":true,"readOnly":false,"relation":{"endpoint":"/api/produtos","valueKey":"id","labelKey":"nome"}}]} relationLoaders={{ "vendaId": vendasService.list, "produtoId": produtosService.list }} onUpdate={itemVendasService.update} onDelete={itemVendasService.remove} />
      {createOpen && createPortal(
        <div className="dialog-overlay" role="presentation" onClick={closeCreateDialog}>
          <section
            className="dialog-content shadcn-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="dialog-header">
              <div>
                <h2 id="create-dialog-title" className="dialog-title">Adicionar</h2>
                <p className="dialog-description">Preencha os dados para criar um novo registro.</p>
              </div>
              <button className="icon-btn" type="button" onClick={closeCreateDialog} aria-label="Fechar">
                <X size={16} aria-hidden="true" />
              </button>
            </header>
            <ApiForm
              submit={itemVendasService.create}
              fields={[{"name":"quantidade","label":"Quantidade","type":"number","required":true,"readOnly":false},{"name":"precoUnitario","label":"Preço Unitário","type":"number","required":true,"readOnly":false},{"name":"vendaId","label":"Venda","type":"number","required":true,"readOnly":false,"relation":{"endpoint":"/api/vendas","valueKey":"id"}},{"name":"produtoId","label":"Produto","type":"number","required":true,"readOnly":false,"relation":{"endpoint":"/api/produtos","valueKey":"id","labelKey":"nome"}}]}
              submitLabel="Adicionar"
              relationLoaders={{ "vendaId": vendasService.list, "produtoId": produtosService.list }}
              onSuccess={() => {
                setCreateOpen(false);
                setReloadToken((value) => value + 1);
              }}
            />
          </section>
        </div>,
        document.body
      )}
    </div>
  );
}
