import { useEffect, useState } from "react";
import {
  login,
  getChaveConfigs,
  getChaveConfigLogs,
  createChaveConfig,
  updateChaveConfig,
  deleteChaveConfig,
} from "../services/api.js";
import "../styles/modal.css";
import "../styles/editVersion.css";

const EMPTY_NOVA_CHAVE = { nome: "", qtd_dukpt: "", qtd_master_key: "" };

function formatLog(log) {
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

export default function ChaveConfigModal({ onClose }) {
  const [tab, setTab] = useState("existentes");
  const [chaves, setChaves] = useState([]);
  const [logs, setLogs] = useState([]);
  const [novaChave, setNovaChave] = useState({ ...EMPTY_NOVA_CHAVE });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAuthConfirm, setShowAuthConfirm] = useState(false);
  const [authTarget, setAuthTarget] = useState(null);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState("form");
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  function notify(message) {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function load() {
    const [chavesData, logsData] = await Promise.all([getChaveConfigs(), getChaveConfigLogs()]);
    setChaves(Array.isArray(chavesData) ? chavesData : []);
    setLogs(Array.isArray(logsData) ? logsData : []);
  }

  function handleFieldChange(id, field, value) {
    setChaves((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function requestSave(chave) {
    setAuthTarget(chave);
    setConfirmEmail("");
    setConfirmPassword("");
    setConfirmError("");
    setShowAuthConfirm(true);
  }

  async function handleAuthConfirm() {
    if (!confirmEmail || !confirmPassword) {
      setConfirmError("Preencha e-mail e senha.");
      return;
    }
    setConfirmLoading(true);
    setConfirmError("");
    try {
      const authRes = await login(confirmEmail, confirmPassword);
      if (!authRes.token) {
        setConfirmError(authRes.message || "Credenciais inválidas.");
        return;
      }
      localStorage.setItem("token", authRes.token);

      const chave = authTarget;
      const res = await updateChaveConfig(chave.id, {
        nome: chave.nome,
        qtd_dukpt: chave.qtd_dukpt !== "" ? Number(chave.qtd_dukpt) : 0,
        qtd_master_key: chave.qtd_master_key !== "" ? Number(chave.qtd_master_key) : 0,
      });

      if (res.id) {
        setShowAuthConfirm(false);
        setAuthTarget(null);
        await load();
        notify("Chave salva com sucesso!");
      } else {
        setConfirmError(res.message || "Erro ao salvar chave.");
      }
    } catch {
      setConfirmError("Erro ao conectar com o servidor.");
    } finally {
      setConfirmLoading(false);
    }
  }

  function requestDelete(chave) {
    setDeleteTarget(chave);
    setDeleteStep("form");
    setDeleteInput("");
    setDeleteEmail("");
    setDeletePassword("");
    setDeleteError("");
  }

  function handleDeleteContinue() {
    if (deleteInput !== deleteTarget.nome) {
      setDeleteError("O nome digitado não corresponde à chave.");
      return;
    }
    if (!deleteEmail || !deletePassword) {
      setDeleteError("Preencha e-mail e senha.");
      return;
    }
    setDeleteError("");
    setDeleteStep("confirm");
  }

  async function handleDeleteConfirm() {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const authRes = await login(deleteEmail, deletePassword);
      if (!authRes.token) {
        setDeleteError(authRes.message || "Credenciais inválidas.");
        setDeleteStep("form");
        return;
      }
      localStorage.setItem("token", authRes.token);

      await deleteChaveConfig(deleteTarget.id);
      setDeleteTarget(null);
      await load();
      notify("Chave excluída com sucesso!");
    } catch {
      setDeleteError("Erro ao excluir chave.");
      setDeleteStep("form");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleAdd() {
    if (!novaChave.nome.trim()) {
      setError("Informe o nome da chave.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await createChaveConfig({
        nome: novaChave.nome,
        qtd_dukpt: novaChave.qtd_dukpt !== "" ? Number(novaChave.qtd_dukpt) : 0,
        qtd_master_key: novaChave.qtd_master_key !== "" ? Number(novaChave.qtd_master_key) : 0,
      });
      if (res.id) {
        setNovaChave({ ...EMPTY_NOVA_CHAVE });
        await load();
        notify("Chave criada com sucesso!");
      } else {
        setError(res.message || "Erro ao criar chave.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 760, maxWidth: "95vw" }}>
        <div className="modal-header">
          <span className="modal-title">Configurar chaves</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {success && <div className="modal-success">{success}</div>}

          <div className="modal-tabs">
            <button
              type="button"
              className={`modal-tab-btn${tab === "existentes" ? " active" : ""}`}
              onClick={() => setTab("existentes")}
            >
              Chaves existentes
            </button>
            <button
              type="button"
              className={`modal-tab-btn${tab === "nova" ? " active" : ""}`}
              onClick={() => setTab("nova")}
            >
              Nova chave
            </button>
          </div>

          <p className="form-hint">
            Cada chave é composta por uma quantidade de DUKPT e de Master Key. O total de cada chave
            (DUKPT + Master Key) é somado automaticamente na quantidade de chaves do pacote quando ela for selecionada.
            Alterar a quantidade de uma chave já existente atualiza automaticamente todos os pacotes que a utilizam.
          </p>

          {tab === "existentes" ? (
            <>
              <div className="chave-config-table-wrapper">
                <table className="chave-config-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>DUKPT</th>
                      <th>Master Key</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {chaves.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <input
                            className="form-input"
                            value={c.nome ?? ""}
                            onChange={(e) => handleFieldChange(c.id, "nome", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="form-input"
                            type="number"
                            min="0"
                            value={c.qtd_dukpt ?? 0}
                            onChange={(e) => handleFieldChange(c.id, "qtd_dukpt", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="form-input"
                            type="number"
                            min="0"
                            value={c.qtd_master_key ?? 0}
                            onChange={(e) => handleFieldChange(c.id, "qtd_master_key", e.target.value)}
                          />
                        </td>
                        <td className="chave-config-total">
                          {(Number(c.qtd_dukpt) || 0) + (Number(c.qtd_master_key) || 0)}
                        </td>
                        <td className="chave-config-actions">
                          <button type="button" className="modal-btn-submit" onClick={() => requestSave(c)}>
                            Salvar
                          </button>
                          <button type="button" className="modal-btn-cancel" onClick={() => requestDelete(c)}>
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                    {chaves.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: "16px 0" }}>
                          Nenhuma chave cadastrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="chave-history-section">
                <span className="chave-history-title">Histórico de alterações</span>
                {logs.length === 0 ? (
                  <p style={{ margin: 0, color: "#9ca3af", fontSize: 13 }}>Nenhuma alteração registrada ainda.</p>
                ) : (
                  <div className="chave-history-list">
                    {logs.map((log) => {
                      const { text, when, who } = formatLog(log);
                      return (
                        <div key={log.id} className="chave-history-item">
                          <span><strong>{text}</strong> — por {who}</span>
                          <span className="chave-history-meta">{when}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="chave-config-new-form">
              <div className="form-group full-width">
                <label>Nome da chave</label>
                <input
                  className="form-input"
                  value={novaChave.nome}
                  onChange={(e) => setNovaChave((prev) => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>DUKPT</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={novaChave.qtd_dukpt}
                  onChange={(e) => setNovaChave((prev) => ({ ...prev, qtd_dukpt: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Master Key</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={novaChave.qtd_master_key}
                  onChange={(e) => setNovaChave((prev) => ({ ...prev, qtd_master_key: e.target.value }))}
                />
              </div>
              <div className="form-group full-width">
                <button type="button" className="modal-btn-submit" onClick={handleAdd} disabled={loading}>
                  {loading ? "Adicionando..." : "Adicionar chave"}
                </button>
              </div>
            </div>
          )}

          {error && <div className="modal-error" style={{ marginTop: 16 }}>{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Fechar</button>
        </div>
      </div>

      {showAuthConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAuthConfirm(false)}>
          <div className="confirm-modal">
            <span className="confirm-modal-title">Confirme sua identidade</span>
            <span className="confirm-modal-subtitle">
              Para salvar as alterações da chave "{authTarget?.nome}", insira suas credenciais de administrador.
            </span>

            <input
              className="form-input"
              type="text"
              placeholder="E-mail"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuthConfirm()}
            />
            <input
              className="form-input"
              type="password"
              placeholder="Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuthConfirm()}
            />

            {confirmError && <div className="confirm-error">{confirmError}</div>}

            <div className="confirm-modal-actions">
              <button className="confirm-cancel" onClick={() => setShowAuthConfirm(false)}>Cancelar</button>
              <button className="confirm-submit" onClick={handleAuthConfirm} disabled={confirmLoading}>
                {confirmLoading ? "Verificando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && deleteStep === "form" && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="confirm-modal">
            <span className="confirm-modal-title">Excluir chave</span>
            <span className="confirm-modal-subtitle">
              Para excluir esta chave, digite o nome exato e informe suas credenciais de administrador: <strong>{deleteTarget.nome}</strong>
            </span>

            <input
              className="form-input delete-input"
              placeholder={`Digite "${deleteTarget.nome}" para confirmar`}
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
            />
            <input
              className="form-input"
              type="text"
              placeholder="E-mail"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
            />
            <input
              className="form-input"
              type="password"
              placeholder="Senha"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDeleteContinue()}
            />

            {deleteError && <div className="confirm-error">{deleteError}</div>}

            <div className="confirm-modal-actions">
              <button className="confirm-cancel" onClick={() => setDeleteTarget(null)}>Cancelar</button>
              <button
                className="delete-package-button"
                style={{ flex: 1, height: 44 }}
                disabled={deleteInput !== deleteTarget.nome || !deleteEmail || !deletePassword}
                onClick={handleDeleteContinue}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && deleteStep === "confirm" && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="confirm-modal">
            <span className="confirm-modal-title">Tem certeza?</span>
            <span className="confirm-modal-subtitle">
              Você está excluindo a chave <strong>{deleteTarget.nome}</strong>. Todos os pacotes que contiverem essa
              chave terão a contagem de chaves (DUKPT/Master Key) recalculada automaticamente, sem considerar mais
              esta chave. Essa ação não pode ser desfeita.
            </span>

            {deleteError && <div className="confirm-error">{deleteError}</div>}

            <div className="confirm-modal-actions">
              <button className="confirm-cancel" onClick={() => setDeleteStep("form")}>Voltar</button>
              <button
                className="delete-package-button"
                style={{ flex: 1, height: 44 }}
                disabled={deleteLoading}
                onClick={handleDeleteConfirm}
              >
                {deleteLoading ? "Excluindo..." : "Excluir definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
