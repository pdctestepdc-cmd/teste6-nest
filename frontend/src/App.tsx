import { Route, Routes } from "react-router-dom";
import { AuthGate } from "./auth";
import { AppShell } from "./components/AppShell";
import ProdutosPage from "./pages/ProdutosPage";
import ClientesPage from "./pages/ClientesPage";
import VendasPage from "./pages/VendasPage";
import ItemVendasPage from "./pages/ItemVendasPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <AuthGate>
      <AppShell brand={`Sistema de Padaria`} links={[{"label":"Início","to":"/"},{"label":"Produtos","to":"/produtos"},{"label":"Clientes","to":"/clientes"},{"label":"Vendas","to":"/vendas"},{"label":"ItemVendas","to":"/itemVendas"}]} layout="sidebar">
        <Routes>
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/vendas" element={<VendasPage />} />
          <Route path="/itemVendas" element={<ItemVendasPage />} />
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </AppShell>
    </AuthGate>
  );
}
