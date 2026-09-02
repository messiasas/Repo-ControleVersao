import { useEffect, useState } from "react";
import { login, createUser, getUsers, updateUser, deleteUser } from "../services/api.js";
import "../styles/modal.css";
import "../styles/editVersion.css";

export default function AddUserModal({ onClose, onSuccess }) {
  const [tab, setTab] = useState("novo");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState("");

  const [saveTarget, setSaveTarget] = useState(null);
  const [saveEmail, setSaveEmail] = useState("");
  const [savePassword, setSavePassword] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (tab === "lista") loadUsers();
  }, [tab]);

  function notify(message) {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function loadUsers() {
    setUsersError("");
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsersError("Erro ao carregar usuários cadastrados.");
    }
  }

  function handleFieldChange(id, field, value) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  }

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
        setEmail("");
        setPassword("");
        setConfirm("");
        onSuccess?.();
        if (tab === "lista") await loadUsers();
        notify("Usuário criado com sucesso!");
      } else {
        setError(res.message || "Erro ao criar usuário.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function requestSave(user) {
    setSaveTarget(user);
    setSaveEmail("");
    setSavePassword("");
    setSaveError("");
  }

  async function handleSaveConfirm() {
    if (!saveEmail || !savePassword) {
      setSaveError("Preencha e-mail e senha.");
      return;
    }
    setSaveLoading(true);
    setSaveError("");
    try {
      const authRes = await login(saveEmail, savePassword);
      if (!authRes.token) {
        setSaveError(authRes.message || "Credenciais inválidas.");
        return;
      }
      localStorage.setItem("token", authRes.token);

      const target = saveTarget;
      const payload = { email: target.email };
      if (target.newPassword) payload.password = target.newPassword;

      const res = await updateUser(target.id, payload);
      if (res.id) {
        setSaveTarget(null);
        await loadUsers();
        notify("Usuário atualizado com sucesso!");
      } else {
        setSaveError(res.message || "Erro ao atualizar usuário.");
      }
    } catch {
      setSaveError("Erro ao conectar com o servidor.");
    } finally {
      setSaveLoading(false);
    }
  }

  function requestDelete(user) {
    setDeleteTarget(user);
    setDeleteEmail("");
    setDeletePassword("");
    setDeleteError("");
  }

  async function handleDeleteConfirm() {
    if (!deleteEmail || !deletePassword) {
      setDeleteError("Preencha e-mail e senha.");
      return;
    }
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const authRes = await login(deleteEmail, deletePassword);
      if (!authRes.token) {
        setDeleteError(authRes.message || "Credenciais inválidas.");
        return;
      }
      localStorage.setItem("token", authRes.token);

      const res = await deleteUser(deleteTarget.id);
      if (res.success) {
        setDeleteTarget(null);
        await loadUsers();
        notify("Usuário excluído com sucesso!");
      } else {
        setDeleteError(res.message || "Erro ao excluir usuário.");
      }
    } catch {
      setDeleteError("Erro ao conectar com o servidor.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 640 }}>
        <div className="modal-header">
          <span className="modal-title">Adicionar usuário admin</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {success && <div className="modal-success">{success}</div>}

          <div className="modal-tabs">
            <button
              type="button"
              className={`modal-tab-btn${tab === "novo" ? " active" : ""}`}
              onClick={() => setTab("novo")}
            >
              Novo usuário
            </button>
            <button
              type="button"
              className={`modal-tab-btn${tab === "lista" ? " active" : ""}`}
              onClick={() => setTab("lista")}
            >
              Usuários cadastrados
            </button>
          </div>

          {tab === "novo" ? (
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

              <div className="form-group">
                <button className="modal-btn-submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Criando..." : "Criar usuário"}
                </button>
              </div>
            </div>
          ) : (
            <div className="chave-config-table-wrapper">
              {usersError && <div className="modal-error" style={{ marginBottom: 16 }}>{usersError}</div>}
              <table className="chave-config-table">
                <thead>
                  <tr>
                    <th>E-mail</th>
                    <th>Nova senha</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <input
                          className="form-input"
                          value={u.email ?? ""}
                          onChange={(e) => handleFieldChange(u.id, "email", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="form-input"
                          type="password"
                          placeholder="Deixe em branco para manter"
                          value={u.newPassword ?? ""}
                          onChange={(e) => handleFieldChange(u.id, "newPassword", e.target.value)}
                        />
                      </td>
                      <td className="chave-config-actions">
                        <button type="button" className="modal-btn-submit" onClick={() => requestSave(u)}>
                          Salvar
                        </button>
                        <button type="button" className="modal-btn-cancel" onClick={() => requestDelete(u)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center", color: "#9ca3af", padding: "16px 0" }}>
                        Nenhum usuário cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Fechar</button>
        </div>
      </div>

      {saveTarget && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSaveTarget(null)}>
          <div className="confirm-modal">
            <span className="confirm-modal-title">Confirme sua identidade</span>
            <span className="confirm-modal-subtitle">
              Para salvar as alterações do usuário "{saveTarget.email}", insira suas credenciais de administrador.
            </span>

            <input
              className="form-input"
              type="text"
              placeholder="E-mail"
              value={saveEmail}
              onChange={(e) => setSaveEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveConfirm()}
            />
            <input
              className="form-input"
              type="password"
              placeholder="Senha"
              value={savePassword}
              onChange={(e) => setSavePassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveConfirm()}
            />

            {saveError && <div className="confirm-error">{saveError}</div>}

            <div className="confirm-modal-actions">
              <button className="confirm-cancel" onClick={() => setSaveTarget(null)}>Cancelar</button>
              <button className="confirm-submit" onClick={handleSaveConfirm} disabled={saveLoading}>
                {saveLoading ? "Verificando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="confirm-modal">
            <span className="confirm-modal-title">Excluir usuário</span>
            <span className="confirm-modal-subtitle">
              Você está excluindo o usuário <strong>{deleteTarget.email}</strong>. Essa ação não pode ser desfeita.
              Insira suas credenciais de administrador para confirmar.
            </span>

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
              onKeyDown={(e) => e.key === "Enter" && handleDeleteConfirm()}
            />

            {deleteError && <div className="confirm-error">{deleteError}</div>}

            <div className="confirm-modal-actions">
              <button className="confirm-cancel" onClick={() => setDeleteTarget(null)}>Cancelar</button>
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
