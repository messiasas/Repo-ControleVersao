import { useEffect, useState } from "react";
import { createVersion, getChaveConfigs, getDistinctPlataformas } from "../services/api.js";
import "../styles/modal.css";

const DEFAULT_PLATAFORMAS = ["Android", "Prolin", "Monitor"];

const INITIAL_FORM = {
  empresa: "",
  equipamento: "",
  modelo: "",
  plataforma: "",
  fw: "",
  sphs: "",
  firmware_version: "",
  versao_so: "",
  security_version: "",
  firmware: "",
  puk_crc: "",
  versao_bt: "",
  versao_wifi: "",
  versao_gprs: "",
  possui_logo: "NÃO",
  qtd_chaves: "",
  configurador: "",
  fonte: "",
  tipo_chaves: "",
};

const EMPTY_APP = { nome: "", versao: "" };
const EMPTY_CHAVE = { chave: "" };

export default function NewPackageModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [aplicacoes, setAplicacoes] = useState([{ ...EMPTY_APP }]);
  const [chavesList, setChavesList] = useState([{ ...EMPTY_CHAVE }]);
  const [chaveConfigs, setChaveConfigs] = useState([]);
  const [existingPlataformas, setExistingPlataformas] = useState(DEFAULT_PLATAFORMAS);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  function handleChaveChange(index, value) {
    setChavesList((prev) => prev.map((c, i) => (i === index ? { chave: value } : c)));
  }

  function addChave() {
    setChavesList((prev) => [...prev, { ...EMPTY_CHAVE }]);
  }

  function removeChave(index) {
    setChavesList((prev) => prev.filter((_, i) => i !== index));
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
        chaves: chavesList.filter((c) => c.chave),
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
              <label>Plataforma</label>
              <input
                className="form-input"
                name="plataforma"
                list="plataformas-existentes"
                value={form.plataforma}
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
              <input className="form-input" name="fw" value={form.fw} onChange={handleChange} placeholder="FW" maxLength={30} />
            </div>
            <div className="form-group">
              <label>SPHS</label>
              <input className="form-input" name="sphs" value={form.sphs} onChange={handleChange} placeholder="SPHS" maxLength={30} />
            </div>
            <div className="form-group">
              <label>Firmware version</label>
              <input className="form-input" name="firmware_version" value={form.firmware_version} onChange={handleChange} placeholder="Firmware version" maxLength={30} />
            </div>
            <div className="form-group">
              <label>Versão SO</label>
              <input className="form-input" name="versao_so" value={form.versao_so} onChange={handleChange} placeholder="Ex: 1.2.3" />
            </div>
            <div className="form-group">
              <label>Security Version(SV)</label>
              <input className="form-input" name="security_version" value={form.security_version} onChange={handleChange} placeholder="Security Version(SV)" maxLength={100} />
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

            <div className="form-section-title chaves-section-title">
              <span>Chaves</span>
              <span className="chaves-total-badge">
                Total de chaves: <span className="chaves-total-value">{form.qtd_chaves || 0}</span>
              </span>
            </div>

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
