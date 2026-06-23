import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api.js";
import logo from "../assets/transire-img.png";
import logoSuporte from "../assets/logo-suporte.png";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await login(email, password);
      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/admin");
      } else {
        setError(res.message || "Credenciais inválidas.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="login-page">
      <div className="login-header">
        <span className="login-header-title">Controle de versão</span>
      </div>

      <div className="login-container">
        <div className="login-panel">
          <img src={logoSuporte} alt="Suporte" className="login-title-image" />

          <input
            className="login-input"
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {error && <span className="login-error">{error}</span>}

          <button
            onClick={handleLogin}
            className="login-button"
            disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>

        <div className="logo-panel">
          <img src={logo} alt="Logo Transire" className="company-logo" />
        </div>
      </div>
    </div>
  );
}

export default Login;
