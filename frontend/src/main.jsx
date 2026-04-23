import "./styles/global.css";
import "./styles/variables.css";

import React from "react";
import ReactDOM from "react-dom/client"; // renderizador
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render( // Procura isso no HTML: <div id="root"></div>
 // renderiza o App dentro do root
    <React.StrictMode>
    <App />
  </React.StrictMode>
);