import logo from "../assets/transire-img.png";
import "../styles/login.css";
import logoSuporte from "../assets/logo-suporte.png";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    function handleLogin() {
        navigate("/admin");
    }

    return (
    <div className="login-page">

    <div className="login-header">
        <span className="login-header-title">
            Controle de versão
        </span>
    </div>

    <div className="login-container">

        <div className="login-panel">

            <img
                src={logoSuporte}
                alt="Suporte"
                className="login-title-image"
            />

            <input
                className="login-input"
                type="text"
                placeholder="Usuário"
            />
            <input
                className="login-input"
                type="password"
                placeholder="Senha"
            />
            <button
            onClick={handleLogin}
            className="login-button">
            Entrar
            </button>
        </div>

        <div className="logo-panel">
            <img
            src={logo}
            alt="Logo Transire"
            className="company-logo"
            />
        </div>

    </div>
    </div>
  );
}

export default Login;