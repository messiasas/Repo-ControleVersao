import "../styles/home.css";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (

    

    <div className="home-container">

    <Header />

      {/* Conteúdo principal */}
      <div className="home-grid">

        {/* Coluna esquerda */}
        <div className="left-column">

          {/* Busca */}
          <div className="search-row">
            <input
              type="text"
              placeholder="Busca por modelo"
              className="search-input"
            />

            <button className="search-button">
              🔍
            </button>
          </div>

          {/* Terminais */}
          <div className="gray-card terminals-card">
            terminais
          </div>

        </div>


        {/* Controle de versões */}
        <div className="gray-card version-card">

            {/* NOVA DIV DO TÍTULO */}
          <div className="version-header">
            <span className="version-title">
              Versionamentos
            </span>
          </div>

          <div className="version-buttons">

            {/* PAX */}
            <button
              className="version-button"
              onClick={() => navigate("/equipamentos")}
            >
              PAX
            </button>

            {/* SUMNI */}
            <button
              className="version-button"
            >
              SUMNI
            </button>

          </div>
        </div>




        

      </div>

      {/* Dashboards inferiores */}
      <div className="bottom-dashboards">

        <div className="gray-card dashboard-card">
          dashboard
        </div>

        <div className="gray-card dashboard-card">
          dashboard
        </div>

        <div className="gray-card dashboard-card">
          dashboard
        </div>

      </div>

    </div>
  );
}

export default Home;