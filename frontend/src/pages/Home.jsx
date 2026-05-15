import "../styles/home.css";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";


import paxImage from "../assets/pax_logo.jpg";
import sumniImage from "../assets/sunmi_logo.jpg";

import { useState } from "react";
import VerticalCarousel from "../components/VerticalCarousel.jsx";

function Home() {
  const navigate = useNavigate();

  const [currentCustomer, setCurrentCustomer] = useState(null);

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
              placeholder="Busca por cliente"
              className="search-input"
            />

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
          <div className="card-search">
           
          </div>

          {/* Terminais */}
          <div className="gray-card terminals-card">

             <VerticalCarousel
              setCurrentCustomer={setCurrentCustomer}
            />

          </div>

        </div>


        {/* Controle de versões */}
        <div className="gray-card version-card">

            {/* NOVA DIV DO TÍTULO */}
          <div className="version-header">
            <span className="version-title">
              Planilhas de versionamento:
            </span>
          </div>

          <div className="version-buttons">

            {/* PAX */}
            <button
              className="version-button"
              onClick={() => navigate("/equipamentos")}

              style={{
                backgroundImage: `url(${paxImage})`
              }}
              >
              <div className="button-overlay">
                
              </div>
            </button>

            {/* SUMNI */}
            <button
              className="version-button"
              style={{
                backgroundImage: `url(${sumniImage})`
              }}
            >
              <div className="button-overlay">
                
              </div>
            </button>

          </div>
        </div>


      </div>

      {/* Dashboards inferiores */}
      <div className="bottom-dashboards">

        <div
          className={`
            gray-card
            dashboard-card
            customer-${currentCustomer?.nome}
        `}>
          <span className="dashboard-big-number">
            {currentCustomer?.terminais || 0}
          </span>

          <span className="dashboard-label">
            modelos de terminais homologados
          </span>
        </div>


        <div
        className={`
            gray-card
            dashboard-card
            customer-${currentCustomer?.nome}
        `}>
          dashboard2
        </div>


        <div
        className={`
            gray-card
            dashboard-card
            customer-${currentCustomer?.nome}
        `}>
          dashboard2


        </div>

        <div
              className={`
          gray-card
          dashboard-card
          customer-${currentCustomer?.nome}
        `}>
          dashboard3

        </div>

      </div>

    </div>
  );
}

export default Home;