import { DataTable, ApiForm, PageBreadcrumb } from "../components";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { produtosService } from "../services/produtos.service";

export default function ProdutosPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const closeCreateDialog = () => setCreateOpen(false);


  return (
    <div className="page">

      <PageBreadcrumb items={[{ label: `Listagem de Produtos` }]} />

      <header className="page-header">
        <div>
          <h1 className="page-title">{`Listagem de Produtos`}</h1>
        </div>
      </header>
      <p style={{ margin: "-18px 0 20px 0" }}>{`Gerencie produtos cadastrados, revise status e execute ações recorrentes.`}</p>
      <div className="page-actions">
        <button className="btn btn-primary" type="button" onClick={() => setCreateOpen(true)}>
          <Plus size={16} aria-hidden="true" />
          Adicionar
        </button>
      </div>
      <DataTable load={produtosService.list} reloadToken={reloadToken} columns={[{"key":"nome","label":"Nome"},{"key":"descricao","label":"Descrição"},{"key":"preco","label":"Preço"},{"key":"quantidadeEstoque","label":"Quantidade em Estoque"}]} idKey={"id"} fields={[{"name":"nome","label":"Nome","type":"text","required":true,"readOnly":false},{"name":"descricao","label":"Descrição","type":"text","required":false,"readOnly":false},{"name":"preco","label":"Preço","type":"number","required":true,"readOnly":false},{"name":"quantidadeEstoque","label":"Quantidade em Estoque","type":"number","required":true,"readOnly":false}]} onUpdate={produtosService.update} onDelete={produtosService.remove} />
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
              submit={produtosService.create}
              fields={[{"name":"nome","label":"Nome","type":"text","required":true,"readOnly":false},{"name":"descricao","label":"Descrição","type":"text","required":false,"readOnly":false},{"name":"preco","label":"Preço","type":"number","required":true,"readOnly":false},{"name":"quantidadeEstoque","label":"Quantidade em Estoque","type":"number","required":true,"readOnly":false}]}
              submitLabel="Adicionar"
              
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
