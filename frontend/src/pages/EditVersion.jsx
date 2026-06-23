import { useEffect, useState } from "react";
import { login, updateVersion } from "../services/api.js";
import "../styles/editVersion.css";
import "../styles/modal.css";

const EMPTY_APP = { nome: "", versao: "" };

export default function EditVersion() {
  const [form, setForm] = useState(null);
  const [aplicacoes, setAplicacoes] = useState([{ ...EMPTY_APP }]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("editVersion");
    if (raw) {
      const parsed = JSON.parse(raw);
      setForm(parsed);
      if (parsed.aplicacoes && parsed.aplicacoes.length > 0) {
        setAplicacoes(parsed.aplicacoes.map((a) => ({ nome: a.nome || "", versao: a.versao || "" })));
      }
    }
  }, []);

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

      const { id, createdAt, updatedAt, aplicacoes: _a, ...payload } = form;
      const res = await updateVersion(id, {
        ...payload,
        qtd_chaves: payload.qtd_chaves !== "" ? Number(payload.qtd_chaves) : null,
        aplicacoes: aplicacoes.filter((a) => a.nome || a.versao),
      });

      if (res && res.id) {
        setSaved(true);
        setShowConfirm(false);
        localStorage.removeItem("editVersion");
      } else {
        setConfirmError(res?.message || "Erro ao salvar alterações.");
      }
    } catch {
      setConfirmError("Erro ao conectar com o servidor.");
    } finally {
      setConfirmLoading(false);
    }
  }

  if (!form) {
    return (
      <div className="edit-page">
        <div className="edit-header">
          <span className="edit-header-title">Editar Pacote</span>
        </div>
        <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
          Nenhum registro selecionado.
        </div>
      </div>
    );
  }

  return (
    <div className="edit-page">
      <div className="edit-header">
        <span className="edit-header-title">Editar Pacote</span>
        <span className="edit-header-subtitle">{form.empresa}</span>
      </div>

      <div className="edit-body">
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

          <div className="form-section-title">Versões de Software</div>

          <div className="form-group">
            <label>Versão SO</label>
            <input className="form-input" name="versao_so" value={form.versao_so ?? ""} onChange={handleChange} />
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
            <input className="form-input" type="number" name="qtd_chaves" value={form.qtd_chaves ?? ""} onChange={handleChange} min="0" />
          </div>
          <div className="form-group">
            <label>Fonte</label>
            <input className="form-input" name="fonte" value={form.fonte ?? ""} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Chaves</label>
            <input className="form-input" name="chaves" value={form.chaves ?? ""} onChange={handleChange} placeholder="Descreva as chaves" />
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

        </div>
      </div>

      <div className="edit-footer">
        <button className="edit-save-button" onClick={() => { setShowConfirm(true); setConfirmError(""); }}>
          Salvar alterações
        </button>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowConfirm(false)}>
          <div className="confirm-modal">
            <span className="confirm-modal-title">Confirme sua identidade</span>
            <span className="confirm-modal-subtitle">Para salvar as alterações, insira suas credenciais de administrador.</span>

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
