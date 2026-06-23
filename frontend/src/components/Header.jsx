import "../styles/header.css";

export default function Header({ theme = "transire" }) {
  const className = theme === "amazonas" ? "header-amazonas" : "header";
  return (
    <div className={className}>
      <span className="header-title">Controle de versão</span>
    </div>
  );
}
