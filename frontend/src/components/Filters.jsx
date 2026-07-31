import "../styles/filters.css";
import logo from "../assets/transire-img.png";
import logoAmazonas from "../assets/amazonas.png";

export default function Filters({ filtros, setFiltros, theme = "transire" }) {
  const src = theme === "amazonas" ? logoAmazonas : logo;
  const alt = theme === "amazonas" ? "Amazonas Inovare" : "Logo";

  function handleChange(field, value) {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className={`toolbar${theme === "amazonas" ? " toolbar-amazonas" : ""}`}>
      <div className="search-fields">
        <div className="search-group">
          <label className="search-label" htmlFor="busca-cliente">Cliente</label>
          <input
            id="busca-cliente"
            className="search-space"
            placeholder="Busque por cliente"
            value={filtros.pacote}
            onChange={(e) => handleChange("pacote", e.target.value)}
          />
        </div>
        <div className="search-group">
          <label className="search-label" htmlFor="busca-equipamento">Equipamento</label>
          <input
            id="busca-equipamento"
            className="search-space"
            placeholder="Busque por equipamento"
            value={filtros.equipamento}
            onChange={(e) => handleChange("equipamento", e.target.value)}
          />
        </div>
        <div className="search-group">
          <label className="search-label" htmlFor="busca-plataforma">Plataforma</label>
          <input
            id="busca-plataforma"
            className="search-space"
            placeholder="Busque por plataforma"
            value={filtros.plataforma}
            onChange={(e) => handleChange("plataforma", e.target.value)}
          />
        </div>
      </div>
      <div className="toolbar-logo-container">
        <img src={src} alt={alt} className="toolbar-logo" />
      </div>
    </div>
  );
}
