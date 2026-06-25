import { useState } from "react";
import { createUser } from "../services/api.js";
import "../styles/modal.css";

export default function AddUserModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");

    if (!email || !password || !confirm)
      return setError("Preencha todos os campos.");

    if (password !== confirm)
      return setError("As senhas não coincidem.");

    if (password.length < 6)
      return setError("A senha deve ter ao menos 6 caracteres.");

    setLoading(true);
    try {
      const res = await createUser(email, password);
      if (res.id) {
        onSuccess?.();
        onClose();
      } else {
        setError(res.message || "Erro ao criar usuário.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 440 }}>
        <div className="modal-header">
          <span className="modal-title">Adicionar usuário admin</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="modal-form" style={{ gridTemplateColumns: "1fr" }}>
            <div className="form-group">
              <label>E-mail <span className="required">*</span></label>
              <input
                className="form-input"
                type="email"
                placeholder="usuario@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label>Senha <span className="required">*</span></label>
              <input
                className="form-input"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label>Confirmar senha <span className="required">*</span></label>
              <input
                className="form-input"
                type="password"
                placeholder="Repita a senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete="new-password"
              />
            </div>

            {error && <div className="modal-error">{error}</div>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="modal-btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Criando..." : "Criar usuário"}
          </button>
        </div>
      </div>
    </div>
  );
}
