import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVersions } from "../services/api.js";
import Header from "../components/Header.jsx";
import Filters from "../components/Filters.jsx";
import Grid from "../components/Grid.jsx";
import NewPackageModal from "../components/NewPackageModal.jsx";

function Admin() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchData = async () => {
        const res = await getVersions(search);
        setData([...res.data]);
      };
      fetchData();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, refresh]);

  function handlePackageSuccess() {
    setShowModal(false);
    setRefresh((r) => r + 1);
  }

  return (
    <div className="app-container">
      <Header theme="amazonas" />

      <div className="top-navigation-amazonas">
        <button className="nav-button-amazonas active">Controle de versão</button>
        <button className="nav-button-amazonas">Adicionar usuário</button>
        <button className="nav-button-amazonas">Histórico</button>
      </div>

      <Filters search={search} setSearch={setSearch} theme="amazonas" />

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
              localStorage.setItem("selectedVersion", JSON.stringify(selectedRow));
              window.open("/version-view", "_blank");
            }
          }}>
          Aplicar visualização única
        </button>


        <button className="new-package-button" onClick={() => setShowModal(true)}>
          Novo pacote
        </button>

        <button
          className={`settings-button ${selectedRow ? "active" : ""}`}
          disabled={!selectedRow}
          onClick={() => {
            if (selectedRow) {
              localStorage.setItem("editVersion", JSON.stringify(selectedRow));
              window.open("/edit-version", "_blank");
            }
          }}>
          Configurações
        </button>
      </div>

      {showModal && (
        <NewPackageModal
          onClose={() => setShowModal(false)}
          onSuccess={handlePackageSuccess}
        />
      )}
    </div>
  );
}

export default Admin;
