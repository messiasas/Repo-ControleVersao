import { useEffect, useState } from "react";
import { login, updateVersion, deleteVersion, getChaveConfigs, getDistinctPlataformas } from "../services/api.js";
import "../styles/editVersion.css";
import "../styles/modal.css";

const DEFAULT_PLATAFORMAS = ["Android", "Prolin", "Monitor"];

const EMPTY_APP = { nome: "", versao: "" };
const EMPTY_CHAVE = { chave: "" };

export default function EditVersionModal({ selectedRow, onClose, onSuccess }) {
  const [form, setForm] = useState(() => ({ ...selectedRow }));
  const [aplicacoes, setAplicacoes] = useState(() =>
    selectedRow.aplicacoes?.length > 0
      ? selectedRow.aplicacoes.map((a) => ({ nome: a.nome || "", versao: a.versao || "" }))
      : [{ ...EMPTY_APP }]
  );
  const [chavesList, setChavesList] = useState(() =>
    selectedRow.chaves?.length > 0
      ? selectedRow.chaves.map((c) => ({ chave: c.chave || "" }))
      : [{ ...EMPTY_CHAVE }]
  );
  const [chaveConfigs, setChaveConfigs] = useState([]);
  const [existingPlataformas, setExistingPlataformas] = useState(DEFAULT_PLATAFORMAS);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    getChaveConfigs().then((data) => setChaveConfigs(Array.isArray(data) ? data : []));
    getDistinctPlataformas().then((data) => {
      const fromApi = Array.isArray(data) ? data : [];
      setExistingPlataformas(Array.from(new Set([...DEFAULT_PLATAFORMAS, ...fromApi])));
    });
  }, []);

  useEffect(() => {
    const total = chavesList.reduce((sum, c) => {
      const config = chaveConfigs.find((cc) => cc.nome === c.chave);
      if (!config) return sum;
      return sum + (Number(config.qtd_dukpt) || 0) + (Number(config.qtd_master_key) || 0);
    }, 0);
    setForm((prev) => ({ ...prev, qtd_chaves: total }));
  }, [chavesList, chaveConfigs]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleAppChange(index, field, value) {
    setAplicacoes((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  }

  function addApp() {
    setAplicacoes((prev) => [...prev, { ...EMPTY_APP }]);
  }

  function removeApp(index) {
    setAplicacoes((prev) => prev.filter((_, i) => i !== index));
  }

  function handleChaveChange(index, value) {
    setChavesList((prev) => prev.map((c, i) => (i === index ? { chave: value } : c)));
  }

  function addChave() {
    setChavesList((prev) => [...prev, { ...EMPTY_CHAVE }]);
  }

  function removeChave(index) {
    setChavesList((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleConfirm() {
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

      if (pendingAction === "delete") {
        const res = await deleteVersion(form.id);
        if (res.message) {
          onSuccess();
          onClose();
        } else {
          setConfirmError(res?.error || "Erro ao excluir pacote.");
        }
        return;
      }

      const { id, createdAt, updatedAt, aplicacoes: _a, chaves: _c, ...payload } = form;
      const res = await updateVersion(id, {
        ...payload,
        qtd_chaves: payload.qtd_chaves !== "" ? Number(payload.qtd_chaves) : null,
        aplicacoes: aplicacoes.filter((a) => a.nome || a.versao),
        chaves: chavesList.filter((c) => c.chave),
      });

      if (res && res.id) {
        setSaved(true);
        setShowConfirm(false);
        onSuccess();
      } else {
        setConfirmError(res?.message || "Erro ao salvar alterações.");
      }
    } catch {
      setConfirmError("Erro ao conectar com o servidor.");
    } finally {
      setConfirmLoading(false);
    }
  }

  return (
    <div className="edit-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="edit-modal-panel">

        <div className="edit-modal-header">
          <span className="edit-header-title">Editar Pacote</span>
          <span className="edit-header-subtitle">{form.empresa}</span>
          <button className="edit-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="edit-modal-body">
          {saved && (
            <div className="confirm-success" style={{ marginBottom: 24 }}>
              Alterações salvas com sucesso!
            </div>
          )}

          <div className="modal-form">

            <div className="form-section-title">Identificação</div>

            <div className="form-group">
              <label>Empresa <span className="required">*</span></label>
              <input className="form-input" name="empresa" value={form.empresa ?? ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Equipamento <span className="required">*</span></label>
              <input className="form-input" name="equipamento" value={form.equipamento ?? ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Modelo <span className="required">*</span></label>
              <input className="form-input" name="modelo" value={form.modelo ?? ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Plataforma</label>
              <input
                className="form-input"
                name="plataforma"
                list="plataformas-existentes"
                value={form.plataforma ?? ""}
                onChange={handleChange}
                placeholder="Ex: Android, Prolin, Monitor"
              />
              <datalist id="plataformas-existentes">
                {existingPlataformas.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
            <div className="form-group">
              <label>FW</label>
              <input className="form-input" name="fw" value={form.fw ?? ""} onChange={handleChange} maxLength={30} />
            </div>
            <div className="form-group">
              <label>SPHS</label>
              <input className="form-input" name="sphs" value={form.sphs ?? ""} onChange={handleChange} maxLength={30} />
            </div>
            <div className="form-group">
              <label>Firmware version</label>
              <input className="form-input" name="firmware_version" value={form.firmware_version ?? ""} onChange={handleChange} maxLength={30} />
            </div>

            <div className="form-section-title">Versões de Software</div>

            <div className="form-group">
              <label>Versão SO</label>
              <input className="form-input" name="versao_so" value={form.versao_so ?? ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Security Version(SV)</label>
              <input className="form-input" name="security_version" value={form.security_version ?? ""} onChange={handleChange} maxLength={100} />
            </div>
            <div className="form-group">
              <label>Firmware</label>
              <input className="form-input" name="firmware" value={form.firmware ?? ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Configurador</label>
              <input className="form-input" name="configurador" value={form.configurador ?? ""} onChange={handleChange} />
            </div>

            <div className="form-section-title">Conectividade</div>

            <div className="form-group">
              <label>Versão BT</label>
              <input className="form-input" name="versao_bt" value={form.versao_bt ?? ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Wi-Fi</label>
              <input className="form-input" name="versao_wifi" value={form.versao_wifi ?? ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>GPRS</label>
              <input className="form-input" name="versao_gprs" value={form.versao_gprs ?? ""} onChange={handleChange} />
            </div>

            <div className="form-section-title">Segurança</div>

            <div className="form-group">
              <label>PUK/CRC</label>
              <input className="form-input" name="puk_crc" value={form.puk_crc ?? ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tipo de Chave</label>
              <input className="form-input" name="tipo_chaves" value={form.tipo_chaves ?? ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Qtd. Chaves</label>
              <input className="form-input" type="number" name="qtd_chaves" value={form.qtd_chaves ?? 0} readOnly min="0" />
              <span className="form-hint" style={{ margin: 0 }}>Calculado automaticamente a partir das chaves selecionadas abaixo.</span>
            </div>
            <div className="form-group">
              <label>Fonte</label>
              <input className="form-input" name="fonte" value={form.fonte ?? ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Possui logo</label>
              <select className="form-input" name="possui_logo" value={form.possui_logo ?? "NÃO"} onChange={handleChange}>
                <option value="NÃO">NÃO</option>
                <option value="SIM">SIM</option>
              </select>
            </div>

            <div className="form-section-title">Aplicações</div>

            <div className="aplicacoes-container">
              {aplicacoes.map((app, i) => (
                <div key={i} className="aplicacao-item">
                  <div className="aplicacao-fields">
                    <div className="form-group">
                      <label>Nome do app</label>
                      <input
                        className="form-input"
                        value={app.nome}
                        onChange={(e) => handleAppChange(i, "nome", e.target.value)}
                        placeholder="Nome da aplicação"
                      />
                    </div>
                    <div className="form-group">
                      <label>Versão app</label>
                      <input
                        className="form-input"
                        value={app.versao}
                        onChange={(e) => handleAppChange(i, "versao", e.target.value)}
                        placeholder="Ex: 3.4.0"
                      />
                    </div>
                  </div>
                  {aplicacoes.length > 1 && (
                    <button
                      type="button"
                      className="remove-app-btn"
                      onClick={() => removeApp(i)}
                      title="Remover aplicação"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-app-btn" onClick={addApp}>
                + Adicionar aplicação
              </button>
            </div>

            <div className="form-section-title">Chaves</div>

            <div className="aplicacoes-container">
              {chavesList.map((c, i) => (
                <div key={i} className="aplicacao-item">
                  <div className="aplicacao-fields">
                    <div className="form-group">
                      <label>Chave</label>
                      <input
                        className="form-input"
                        list="chaves-existentes"
                        value={c.chave}
                        onChange={(e) => handleChaveChange(i, e.target.value)}
                        placeholder="Selecione uma chave existente ou digite uma nova"
                      />
                    </div>
                  </div>
                  {chavesList.length > 1 && (
                    <button
                      type="button"
                      className="remove-app-btn"
                      onClick={() => removeChave(i)}
                      title="Remover chave"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-app-btn" onClick={addChave}>
                + Adicionar chave
              </button>
              <datalist id="chaves-existentes">
                {chaveConfigs.map((c) => (
                  <option key={c.id} value={c.nome} />
                ))}
              </datalist>
            </div>

            <div className="form-group full-width delete-zone">
              <label>Para excluir este pacote, digite o nome da empresa: <strong>{form.empresa}</strong></label>
              <input
                className="form-input delete-input"
                placeholder={`Digite "${form.empresa}" para confirmar`}
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
              />
            </div>

          </div>
        </div>

        <div className="edit-modal-footer">
          <button
            className="delete-package-button"
            disabled={deleteInput !== form.empresa}
            onClick={() => { setPendingAction("delete"); setShowConfirm(true); setConfirmError(""); }}
          >
            Excluir pacote
          </button>
          <button
            className="edit-save-button"
            onClick={() => { setPendingAction("save"); setShowConfirm(true); setConfirmError(""); }}
          >
            Salvar alterações
          </button>
        </div>

      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowConfirm(false)}>
          <div className="confirm-modal">
            <span className="confirm-modal-title">Confirme sua identidade</span>
            <span className="confirm-modal-subtitle">
              {pendingAction === "delete"
                ? "Para excluir o pacote, insira suas credenciais de administrador."
                : "Para salvar as alterações, insira suas credenciais de administrador."}
            </span>

            <input
              className="form-input"
              type="text"
              placeholder="E-mail"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            />
            <input
              className="form-input"
              type="password"
              placeholder="Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            />

            {confirmError && <div className="confirm-error">{confirmError}</div>}

            <div className="confirm-modal-actions">
              <button className="confirm-cancel" onClick={() => setShowConfirm(false)}>Cancelar</button>
              <button className="confirm-submit" onClick={handleConfirm} disabled={confirmLoading}>
                {confirmLoading ? "Verificando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
