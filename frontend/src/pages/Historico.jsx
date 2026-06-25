import { useEffect, useState } from "react";
import { getLogsPackages } from "../services/api.js";
import "../styles/historico.css";

export default function Historico({ onSelectPackage }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getLogsPackages().then((data) => {
      setPackages(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const filtered = packages.filter((pkg) =>
    (pkg.empresa || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="historico-container">
      <div className="historico-toolbar">
        <h2 className="historico-title">Histórico de pacotes</h2>
        <input
          className="historico-search"
          type="text"
          placeholder="Buscar empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="historico-loading">Carregando...</p>
      ) : filtered.length === 0 ? (
        <p className="historico-empty">Nenhum registro encontrado.</p>
      ) : (
        <table className="historico-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Empresa</th>
              <th>Equipamento</th>
              <th>Última atualização</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((pkg, i) => (
              <tr key={pkg.id} className={`historico-row${pkg.deleted ? " historico-row--deleted" : ""}`} onClick={() => onSelectPackage(pkg)}>
                <td>{i + 1}</td>
                <td>
                  {pkg.empresa || "—"}
                  {pkg.deleted && <span className="badge-excluido">Excluído</span>}
                </td>
                <td>{pkg.equipamento || "—"}</td>
                <td>{new Date(pkg.updatedAt).toLocaleString("pt-BR")}</td>
                <td>{pkg.lastEditor || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
