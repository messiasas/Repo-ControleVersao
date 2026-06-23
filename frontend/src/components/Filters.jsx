import "../styles/filters.css";
import logo from "../assets/transire-img.png";
import logoAmazonas from "../assets/amazonas.png";

export default function Filters({ search, setSearch, theme = "transire" }) {
  const src = theme === "amazonas" ? logoAmazonas : logo;
  const alt = theme === "amazonas" ? "Amazonas Inovare" : "Logo";

  return (
    <div className="toolbar">
      <input
        className="search-space"
        placeholder="Busque por cliente"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="toolbar-logo-container">
        <img src={src} alt={alt} className="toolbar-logo" />
      </div>
    </div>
  );
}
