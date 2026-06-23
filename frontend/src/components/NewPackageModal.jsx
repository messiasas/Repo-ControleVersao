import { useState } from "react";
import { createVersion } from "../services/api.js";
import "../styles/modal.css";

const INITIAL_FORM = {
  empresa: "",
  equipamento: "",
  modelo: "",
  versao_so: "",
  firmware: "",
  puk_crc: "",
  versao_bt: "",
  versao_wifi: "",
  versao_gprs: "",
  possui_logo: "NÃO",
  chaves: "",
  qtd_chaves: "",
  configurador: "",
  fonte: "",
  tipo_chaves: "",
};

const EMPTY_APP = { nome: "", versao: "" };

export default function NewPackageModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [aplicacoes, setAplicacoes] = useState([{ ...EMPTY_APP }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  async function handleSubmit() {
    if (!form.empresa || !form.equipamento || !form.modelo) {
      setError("Os campos Empresa, Equipamento e Modelo são obrigatórios.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await createVersion({
        ...form,
        qtd_chaves: form.qtd_chaves !== "" ? Number(form.qtd_chaves) : null,
        aplicacoes: aplicacoes.filter((a) => a.nome || a.versao),
      });
      if (res.id) {
        onSuccess();
      } else {
        setError(res.message || "Erro ao criar pacote.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Novo Pacote</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="modal-form">

            <div className="form-section-title">Terminal</div>

            <div className="form-group">
              <label>Empresa <span className="required">*</span></label>
              <input className="form-input" name="empresa" value={form.empresa} onChange={handleChange} placeholder="Nome da empresa" />
            </div>
            <div className="form-group">
              <label>Equipamento <span className="required">*</span></label>
              <input className="form-input" name="equipamento" value={form.equipamento} onChange={handleChange} placeholder="Tipo de equipamento" />
            </div>
            <div className="form-group">
              <label>Modelo <span className="required">*</span></label>
              <input className="form-input" name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo do equipamento" />
            </div>
            <div className="form-group">
              <label>Versão SO</label>
              <input className="form-input" name="versao_so" value={form.versao_so} onChange={handleChange} placeholder="Ex: 1.2.3" />
            </div>
            <div className="form-group">
              <label>Firmware</label>
              <input className="form-input" name="firmware" value={form.firmware} onChange={handleChange} placeholder="Ex: 2.0.1" />
            </div>
            <div className="form-group">
              <label>PUK/CRC</label>
              <input className="form-input" name="puk_crc" value={form.puk_crc} onChange={handleChange} placeholder="PUK ou CRC" />
            </div>
            <div className="form-group">
              <label>Versão BT</label>
              <input className="form-input" name="versao_bt" value={form.versao_bt} onChange={handleChange} placeholder="Bluetooth" />
            </div>
            <div className="form-group">
              <label>Wi-Fi</label>
              <input className="form-input" name="versao_wifi" value={form.versao_wifi} onChange={handleChange} placeholder="Versão Wi-Fi" />
            </div>
            <div className="form-group">
              <label>GPRS</label>
              <input className="form-input" name="versao_gprs" value={form.versao_gprs} onChange={handleChange} placeholder="Versão GPRS" />
            </div>
            <div className="form-group">
              <label>Configurador</label>
              <input className="form-input" name="configurador" value={form.configurador} onChange={handleChange} placeholder="Versão do configurador" />
            </div>
            <div className="form-group">
              <label>Fonte</label>
              <input className="form-input" name="fonte" value={form.fonte} onChange={handleChange} placeholder="Fonte" />
            </div>
            <div className="form-group">
              <label>Chaves</label>
              <input className="form-input" name="chaves" value={form.chaves} onChange={handleChange} placeholder="Nome(s) das chaves" />
            </div>
            <div className="form-group">
              <label>Qtd. Chaves</label>
              <input className="form-input" type="number" name="qtd_chaves" value={form.qtd_chaves} onChange={handleChange} placeholder="0" min="0" />
            </div>
            <div className="form-group">
              <label>Tipo de Chave</label>
              <input className="form-input" name="tipo_chaves" value={form.tipo_chaves} onChange={handleChange} placeholder="Tipo da chave" />
            </div>
            <div className="form-group">
              <label>Possui logo</label>
              <select className="form-input" name="possui_logo" value={form.possui_logo} onChange={handleChange}>
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

            {error && <div className="modal-error">{error}</div>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="modal-btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar pacote"}
          </button>
        </div>
      </div>
    </div>
  );
}
