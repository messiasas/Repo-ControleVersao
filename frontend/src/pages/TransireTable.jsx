import {useEffect, useState} from "react"
import {getVersions} from "../services/api.js"
import Header from "../components/Header.jsx";
import Filters from "../components/Filters.jsx"
import Grid from "../components/Grid.jsx"
import { useNavigate } from "react-router-dom";
import "../styles/modal.css";


function TransireTable(){
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const [showSobre, setShowSobre] = useState(false);

    useEffect(() => {

        const delayDebounce = setTimeout(() => {
        const fetchData = async () => {
        const res = await getVersions(search);

        setData([...res.data]);
    };

    fetchData();
    }, 500);

    return () => clearTimeout(delayDebounce);
    }, [search]);

    console.log(data);

     const navigate = useNavigate();

    return (
    <div className="app-container">

      <Header />

      <div className="top-navigation">

        <button className="nav-button active">
          Controle de versão
        </button>

        <button 
          className="nav-button"
          onClick={() => navigate("/login")}>
        
          Suporte
        </button>

        <button className="nav-button" onClick={() => setShowSobre(true)}>
          Sobre
        </button>

      </div>

      <Filters
        search={search}
        setSearch={setSearch}
      />

      <div className="bottom-toolbar bottom-toolbar--single">

        <button
          className={`apply-button ${selectedRow ? "active" : ""}`}
          onClick={() => {
          console.log("Aplicar visualização única");

            if(selectedRow){
              console.log("Linha atualmente selecionada:");
              console.log(selectedRow);

            // MVP soluction
            localStorage.setItem(
              "selectedVersion",
              JSON.stringify(selectedRow)
            );

            window.open(
              "/version-view",
              "_blank"
            );
            }else{
              console.log("Nenhuma linha selecionada");
            }
          }}>
          Aplicar visualização única
        </button>

      </div>

      <Grid
        data={data}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />

      {showSobre && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowSobre(false)}>
          <div className="modal" style={{ width: 480 }}>
            <div className="modal-header">
              <span className="modal-title">Sobre o sistema</span>
              <button className="modal-close" onClick={() => setShowSobre(false)}>×</button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.6 }}>
                O <strong>Controle de Versão</strong> é uma plataforma interna para gerenciamento
                de pacotes de software embarcado em terminais de pagamento.
              </p>
              <p style={{ margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.6 }}>
                Permite consultar, registrar e acompanhar as versões de sistema operacional,
                firmware, aplicações e módulos de conectividade de cada equipamento,
                organizados por empresa e modelo.
              </p>
              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#6b7280" }}>
                <span><strong>Versão:</strong> 1.0</span>
                <span><strong>Desenvolvido por:</strong> Filipe Messias Silva — Amazonas Inovare</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn-submit" onClick={() => setShowSobre(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

    </div>
)}

export default TransireTable;

