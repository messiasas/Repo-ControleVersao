import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import "../styles/modal.css";

function SobreModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sobre" style={{ width: 680, maxWidth: "95vw" }}>
        <div className="modal-header">
          <span className="modal-title">Sobre o sistema</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
            O <strong>Controle de Versão</strong> é uma plataforma interna da Amazonas Inovare
            para gerenciamento centralizado de pacotes de software embarcado em terminais de pagamento.
            Desenvolvida para equipes técnicas de suporte e operações, ela oferece visibilidade
            completa sobre o estado de cada equipamento em campo.
          </p>

          <div>
            <p style={{ margin: "0 0 10px 0", fontWeight: 600, fontSize: 14, color: "#1f2937" }}>
              Principais funcionalidades
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 7, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
              <li>Consulta e filtragem de versões por pacote, modelo e equipamento</li>
              <li>Registro de novos pacotes com controle de versão de SO, firmware, aplicações e conectividade</li>
              <li>Visualização detalhada por equipamento com painel de informações completo</li>
              <li>Histórico de alterações com rastreabilidade de pacotes aplicados</li>
              <li>Gestão de aplicações embarcadas com nome e versão individuais</li>
              <li>Controle de chaves, configurador e personalização por pacote</li>
            </ul>
          </div>

          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#1f2937" }}>Como usar</p>
            <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
              <li>Selecione uma linha na tabela para destacar o equipamento desejado</li>
              <li>Use <strong>Visualizar</strong> para abrir o painel completo em nova aba</li>
              <li>Utilize a barra de busca para filtrar por pacote, modelo ou versão</li>
            </ol>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: 0 }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", fontSize: 13, color: "#6b7280" }}>
            <span><strong>Versão:</strong> 1.0</span>
            <span><strong>Plataforma:</strong> Web (React + Node.js)</span>
            <span><strong>Desenvolvido por:</strong> Filipe Messias Silva</span>
            <span><strong>Organização:</strong> Amazonas Inovare</span>
            <span><strong>Suporte:</strong> filipe.messias@amazonasinovare.com.br</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn-submit" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSobre, setShowSobre] = useState(false);

  return (
    <>
      <Header />

      <div className="top-navigation">
        <button
          className={`nav-button ${location.pathname === "/" ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          Controle de versão
        </button>

        <button
          className={`nav-button ${location.pathname === "/login" ? "active" : ""}`}
          onClick={() => navigate("/login")}
        >
          Suporte
        </button>

        <button
          className={`nav-button ${showSobre ? "active" : ""}`}
          onClick={() => setShowSobre(true)}
        >
          Sobre
        </button>
      </div>

      {showSobre && <SobreModal onClose={() => setShowSobre(false)} />}
    </>
  );
}

export default TopNav;
