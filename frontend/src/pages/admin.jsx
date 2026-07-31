import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVersions } from "../services/api.js";
import Header from "../components/Header.jsx";
import Filters from "../components/Filters.jsx";
import Grid from "../components/Grid.jsx";
import NewPackageModal from "../components/NewPackageModal.jsx";
import Historico from "./Historico.jsx";
import HistoricoDetalhe from "./HistoricoDetalhe.jsx";
import AddUserModal from "../components/AddUserModal.jsx";
import EditVersionModal from "../components/EditVersionModal.jsx";
import ChaveConfigModal from "../components/ChaveConfigModal.jsx";
import { openVersionView } from "../utils/openVersionView.js";

function Admin() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({ pacote: "", equipamento: "", plataforma: "" });
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChaveConfig, setShowChaveConfig] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [view, setView] = useState("versoes"); // "versoes" | "historico" | "historico-detalhe"
  const [selectedHistorico, setSelectedHistorico] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = (e) => {
      const newView = e.state?.view || "versoes";
      setView(newView);
      if (e.state?.data) setSelectedHistorico(e.state.data);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigateTo(newView, data = null) {
    window.history.pushState({ view: newView, data }, "");
    setView(newView);
    if (data) setSelectedHistorico(data);
  }

  useEffect(() => {
    if (view !== "versoes") return;
    const delayDebounce = setTimeout(() => {
      const fetchData = async () => {
        const res = await getVersions(filtros);
        setData([...res.data]);
      };
      fetchData();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [filtros, refresh, view]);

  function handlePackageSuccess() {
    setShowModal(false);
    setRefresh((r) => r + 1);
  }

  function handleSelectHistorico(pkg) {
    navigateTo("historico-detalhe", pkg);
  }

  return (
    <div className="app-container">
      <Header theme="amazonas" />

      <div className="top-navigation-amazonas">
        <button
          className={`nav-button-amazonas ${view === "versoes" ? "active" : ""}`}
          onClick={() => navigateTo("versoes")}
        >
          Controle de versão
        </button>
        <button className="nav-button-amazonas" onClick={() => setShowAddUser(true)}>Adicionar usuário</button>
        <button
          className={`nav-button-amazonas ${view === "historico" || view === "historico-detalhe" ? "active" : ""}`}
          onClick={() => navigateTo("historico")}
        >
          Histórico
        </button>
      </div>

      {view === "versoes" && (
        <>
          <Filters filtros={filtros} setFiltros={setFiltros} theme="amazonas" />

          <Grid
            data={data}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            theme="amazonas"
          />

          <div className="bottom-toolbar">
            <button
              className={`apply-button ${selectedRow ? "active" : ""}`}
              onClick={() => {
                if (selectedRow) {
                  openVersionView(selectedRow);
                }
              }}
            >
              Visualizar
            </button>

            <button className="new-package-button" onClick={() => setShowModal(true)}>
              Novo pacote
            </button>

            <button
              className={`settings-button ${selectedRow ? "active" : ""}`}
              disabled={!selectedRow}
              onClick={() => { if (selectedRow) setShowEditModal(true); }}
            >
              Configurações
            </button>

            <button className="chave-config-button" onClick={() => setShowChaveConfig(true)}>
              Configurar chaves
            </button>
          </div>
        </>
      )}

      {view === "historico" && (
        <Historico onSelectPackage={handleSelectHistorico} />
      )}

      {view === "historico-detalhe" && selectedHistorico && (
        <HistoricoDetalhe pkg={selectedHistorico} />
      )}

      {showModal && (
        <NewPackageModal
          onClose={() => setShowModal(false)}
          onSuccess={handlePackageSuccess}
        />
      )}

      {showAddUser && (
        <AddUserModal onClose={() => setShowAddUser(false)} />
      )}

      {showEditModal && selectedRow && (
        <EditVersionModal
          selectedRow={selectedRow}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => { setRefresh((r) => r + 1); setShowEditModal(false); }}
        />
      )}

      {showChaveConfig && (
        <ChaveConfigModal onClose={() => setShowChaveConfig(false)} />
      )}
    </div>
  );
}

export default Admin;
