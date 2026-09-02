import { useEffect, useState } from "react";
import { getLogsPackages, getChaveConfigLogs } from "../services/api.js";
import "../styles/historico.css";

function formatChaveLog(log) {
  const details = log.details ? JSON.parse(log.details) : null;
  const when = new Date(log.createdAt).toLocaleString("pt-BR");
  const who = log.user?.email || "—";

  if (!details) return { text: "Alteração de chave.", when, who };

  if (log.action === "CREATE") {
    return {
      text: `Chave "${details.nome}" criada (DUKPT: ${details.qtd_dukpt ?? 0}, Master Key: ${details.qtd_master_key ?? 0})`,
      when,
      who,
    };
  }

  if (log.action === "DELETE") {
    return { text: `Chave "${details.nome}" excluída`, when, who };
  }

  if (log.action === "UPDATE" && details.before && details.after) {
    const { before, after } = details;
    const changes = [];
    if (before.nome !== after.nome) changes.push(`nome: ${before.nome} → ${after.nome}`);
    if (Number(before.qtd_dukpt) !== Number(after.qtd_dukpt)) {
      changes.push(`DUKPT: ${before.qtd_dukpt ?? 0} → ${after.qtd_dukpt ?? 0}`);
    }
    if (Number(before.qtd_master_key) !== Number(after.qtd_master_key)) {
      changes.push(`Master Key: ${before.qtd_master_key ?? 0} → ${after.qtd_master_key ?? 0}`);
    }
    const changeText = changes.length > 0 ? changes.join(", ") : "sem alterações de valor";
    return { text: `Chave "${after.nome}" atualizada (${changeText})`, when, who };
  }

  return { text: "Alteração de chave.", when, who };
}

export default function Historico({ onSelectPackage }) {
  const [tab, setTab] = useState("pacotes"); // "pacotes" | "chaves"

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [chaveLogs, setChaveLogs] = useState([]);
  const [chaveLogsLoading, setChaveLogsLoading] = useState(true);

  useEffect(() => {
    getLogsPackages().then((data) => {
      setPackages(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getChaveConfigLogs().then((data) => {
      setChaveLogs(Array.isArray(data) ? data : []);
      setChaveLogsLoading(false);
    });
  }, []);

  const filtered = packages.filter((pkg) =>
    (pkg.pacote || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="historico-container">
      <div className="historico-tabs">
        <button
          type="button"
          className={`historico-tab-btn${tab === "pacotes" ? " active" : ""}`}
          onClick={() => setTab("pacotes")}
        >
          Pacotes
        </button>
        <button
          type="button"
          className={`historico-tab-btn${tab === "chaves" ? " active" : ""}`}
          onClick={() => setTab("chaves")}
        >
          Chaves
        </button>
      </div>

      {tab === "pacotes" ? (
        <>
          <div className="historico-toolbar">
            <h2 className="historico-title">Histórico de pacotes</h2>
            <input
              className="historico-search"
              type="text"
              placeholder="Buscar pacote..."
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
                  <th>Pacote</th>
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
                      {pkg.pacote || "—"}
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
        </>
      ) : (
        <>
          <div className="historico-toolbar">
            <h2 className="historico-title">Histórico de alterações de chaves</h2>
          </div>

          {chaveLogsLoading ? (
            <p className="historico-loading">Carregando...</p>
          ) : chaveLogs.length === 0 ? (
            <p className="historico-empty">Nenhuma alteração registrada ainda.</p>
          ) : (
            <div className="chave-history-list">
              {chaveLogs.map((log) => {
                const { text, when, who } = formatChaveLog(log);
                return (
                  <div key={log.id} className="chave-history-item">
                    <span><strong>{text}</strong> — por {who}</span>
                    <span className="chave-history-meta">{when}</span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
