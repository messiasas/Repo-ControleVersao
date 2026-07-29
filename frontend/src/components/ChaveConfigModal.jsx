import { useEffect, useState } from "react";
import {
  getChaveConfigs,
  createChaveConfig,
  updateChaveConfig,
  deleteChaveConfig,
} from "../services/api.js";
import "../styles/modal.css";

const EMPTY_NOVA_CHAVE = { nome: "", qtd_dukpt: "", qtd_master_key: "" };

export default function ChaveConfigModal({ onClose }) {
  const [chaves, setChaves] = useState([]);
  const [novaChave, setNovaChave] = useState({ ...EMPTY_NOVA_CHAVE });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getChaveConfigs();
    setChaves(Array.isArray(data) ? data : []);
  }

  function handleFieldChange(id, field, value) {
    setChaves((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  async function handleSave(chave) {
    setError("");
    try {
      const res = await updateChaveConfig(chave.id, {
        nome: chave.nome,
        qtd_dukpt: chave.qtd_dukpt !== "" ? Number(chave.qtd_dukpt) : 0,
        qtd_master_key: chave.qtd_master_key !== "" ? Number(chave.qtd_master_key) : 0,
      });
      if (res.id) {
        await load();
      } else {
        setError(res.message || "Erro ao salvar chave.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteChaveConfig(id);
      await load();
    } catch {
      setError("Erro ao excluir chave.");
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
          <p className="form-hint">
            Cada chave é composta por uma quantidade de DUKPT e de Master Key. O total de cada chave
            (DUKPT + Master Key) é somado automaticamente na quantidade de chaves do pacote quando ela for selecionada.
          </p>

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
                      <button type="button" className="modal-btn-submit" onClick={() => handleSave(c)}>
                        Salvar
                      </button>
                      <button type="button" className="modal-btn-cancel" onClick={() => handleDelete(c.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <input
                      className="form-input"
                      placeholder="Ex: SUMUP"
                      value={novaChave.nome}
                      onChange={(e) => setNovaChave((prev) => ({ ...prev, nome: e.target.value }))}
                    />
                  </td>
                  <td>
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={novaChave.qtd_dukpt}
                      onChange={(e) => setNovaChave((prev) => ({ ...prev, qtd_dukpt: e.target.value }))}
                    />
                  </td>
                  <td>
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={novaChave.qtd_master_key}
                      onChange={(e) => setNovaChave((prev) => ({ ...prev, qtd_master_key: e.target.value }))}
                    />
                  </td>
                  <td className="chave-config-total">—</td>
                  <td className="chave-config-actions">
                    <button type="button" className="modal-btn-submit" onClick={handleAdd} disabled={loading}>
                      {loading ? "Adicionando..." : "Adicionar"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {error && <div className="modal-error" style={{ marginTop: 16 }}>{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
