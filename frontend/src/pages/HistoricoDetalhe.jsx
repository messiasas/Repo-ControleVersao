import { useEffect, useState } from "react";
import { getVersionHistory } from "../services/api.js";
import "../styles/historico.css";

const FIELD_LABELS = {
  empresa:      "Empresa",
  equipamento:  "Equipamento",
  modelo:       "Modelo",
  versao_so:    "Versão SO",
  firmware:     "Firmware",
  puk_crc:      "PUK/CRC",
  versao_bt:    "Versão BT",
  versao_wifi:  "Wi-Fi",
  versao_gprs:  "GPRS",
  possui_logo:  "Possui logo",
  chaves:       "Chaves",
  qtd_chaves:   "Qtd Chaves",
  configurador: "Configurador",
  fonte:        "Fonte",
  tipo_chaves:  "Tipo de chave",
};

function computeDiff(current, previous) {
  const changed = {};

  for (const key of Object.keys(FIELD_LABELS)) {
    const valCurrent = current[key] ?? "";
    const valPrevious = previous[key] ?? "";
    if (String(valCurrent) !== String(valPrevious)) {
      changed[key] = { from: valPrevious, to: valCurrent };
    }
  }

  const appsNow = JSON.stringify((current.aplicacoes || []).map(a => ({ nome: a.nome, versao: a.versao })));
  const appsBefore = JSON.stringify((previous.aplicacoes || []).map(a => ({ nome: a.nome, versao: a.versao })));
  if (appsNow !== appsBefore) {
    changed._aplicacoes = { from: previous.aplicacoes || [], to: current.aplicacoes || [] };
  }

  return changed;
}

export default function HistoricoDetalhe({ pkg }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVersionHistory(pkg.id).then((data) => {
      setLogs(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [pkg.id]);

  return (
    <div className="historico-detalhe-container">
      <div className="historico-detalhe-header">
        <span className="historico-detalhe-title">
          {pkg.empresa} — {pkg.equipamento}
        </span>
      </div>

      {loading ? (
        <p className="historico-loading">Carregando...</p>
      ) : logs.length === 0 ? (
        <p className="historico-empty">Nenhum histórico encontrado para este pacote.</p>
      ) : (
        <div className="historico-timeline">
          {logs.map((log, index) => {
            const details = log.details ? JSON.parse(log.details) : null;
            const isCriacao = log.action === "CREATE";

            const previousDetails = index > 0 && logs[index - 1].details
              ? JSON.parse(logs[index - 1].details)
              : null;

            const diff = (!isCriacao && details && previousDetails)
              ? computeDiff(details, previousDetails)
              : null;

            const hasDiff = diff && Object.keys(diff).length > 0;

            return (
              <div key={log.id} className="timeline-item">
                <div className="timeline-marker">
                  <span className={`timeline-badge ${isCriacao ? "badge-create" : "badge-update"}`}>
                    {isCriacao ? "Pacote criado" : "Pacote atualizado"}
                  </span>
                  <span className="timeline-date">
                    {new Date(log.createdAt).toLocaleString("pt-BR")}
                  </span>
                  {log.user?.email && (
                    <span className="timeline-user">por {log.user.email}</span>
                  )}
                </div>

                <div className="timeline-card">
                  {!details ? (
                    <p className="historico-no-details">Dados do snapshot não disponíveis para este registro.</p>
                  ) : isCriacao ? (
                    /* CREATE: mostra todos os campos preenchidos */
                    <>
                      <div className="timeline-fields">
                        {Object.entries(FIELD_LABELS).map(([key, label]) =>
                          details[key] != null && details[key] !== "" ? (
                            <div key={key} className="timeline-field-row">
                              <span className="timeline-field-label">{label}</span>
                              <span className="timeline-field-value">{String(details[key])}</span>
                            </div>
                          ) : null
                        )}
                      </div>
                      {details.aplicacoes?.length > 0 && (
                        <AppsTable apps={details.aplicacoes} />
                      )}
                    </>
                  ) : hasDiff ? (
                    /* UPDATE com diferenças: mostra só o que mudou */
                    <>
                      <p className="diff-subtitle">Campos alterados nesta atualização:</p>
                      <div className="timeline-fields">
                        {Object.entries(diff).filter(([k]) => k !== "_aplicacoes").map(([key, { from, to }]) => (
                          <div key={key} className="timeline-field-row diff-row">
                            <span className="timeline-field-label">{FIELD_LABELS[key]}</span>
                            <span className="diff-values">
                              <span className="diff-from">{String(from) || "—"}</span>
                              <span className="diff-arrow">→</span>
                              <span className="diff-to">{String(to) || "—"}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                      {diff._aplicacoes && (
                        <div className="diff-apps-section">
                          <p className="diff-subtitle">Aplicações antes:</p>
                          <AppsTable apps={diff._aplicacoes.from} />
                          <p className="diff-subtitle" style={{ marginTop: 12 }}>Aplicações depois:</p>
                          <AppsTable apps={diff._aplicacoes.to} />
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="historico-no-details">Nenhuma alteração detectada neste evento.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AppsTable({ apps }) {
  if (!apps || apps.length === 0) return null;
  return (
    <div className="timeline-apps">
      <span className="timeline-apps-label">Aplicações</span>
      <table className="historico-apps-table">
        <thead>
          <tr><th>#</th><th>Nome</th><th>Versão</th></tr>
        </thead>
        <tbody>
          {apps.map((a, j) => (
            <tr key={j}>
              <td>{j + 1}</td>
              <td>{a.nome || "—"}</td>
              <td>{a.versao || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
