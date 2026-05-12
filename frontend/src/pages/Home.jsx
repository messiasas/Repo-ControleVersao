// src/pages/Home.jsx
import PaxTable from "./PaxTable.jsx"
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Tela Inicial</h1>

      <button onClick={() => navigate("/equipamentos")}>
        Ir para Equipamentos
      </button>

      {/* <button onClick={() => navigate("/chaves")}>
        Ir para Chaves
      </button> */}
      
       {/* <PaxTable /> */}
    </div>
  );
}

export default Home;