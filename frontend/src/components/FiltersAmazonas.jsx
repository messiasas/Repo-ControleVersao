import "../styles/filters.css";
import logoAmazonas from "../assets/amazonas.png";

export default function FiltersAmazonas({ search, setSearch }) {
  return (
    <div className="toolbar">

      <input
        className="search-space"
        placeholder="Busque por cliente"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="toolbar-logo-container-amazonas">
        <img
          src={logoAmazonas}
          alt="Amazonas Inovare"
          className="toolbar-logo-amazonas"
        />
      </div>

    </div>
  );
}