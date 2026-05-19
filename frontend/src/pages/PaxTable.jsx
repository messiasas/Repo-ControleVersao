import {useEffect, useState} from "react" // useState serve para guardar dados que mudam na tela,
                                        //   useEffetc serve para executar algo automaticamente
import {getVersions} from "../services/api.js"
import Header from "../components/Header.jsx";
import VersionGrid from "../components/VersionGrid.jsx";
import { useRef } from "react";
import logo from "../assets/transire-img.png";

function PaxTable(){
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);

    const gridRef = useRef();
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        const fetchData = async () => {
        const res = await getVersions(search);

        console.log("RES:", res);
        console.log("DATA:", res.data);

        console.log("ANTES DO SET:", res.data.length);
        setData([...res.data]);
    };

    fetchData();
    }, 500); // espera 500ms

    console.log("DATA NO STATE:", data.length);

    return () => clearTimeout(delayDebounce);
    }, [search]);

    console.log(data);

    return (
  <div className="app-container">

    <Header />

    <div className="top-navigation">

      <button className="nav-button active">
        Controle de versão
      </button>

      <button className="nav-button">
        Suporte
      </button>

      <button className="nav-button">
        Sobre
      </button>
    </div>

    <div className="toolbar">

      <input
        className="search-space"
        placeholder="Busque por cliente"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    <div className="toolbar-logo-container">
      <img
        src={logo}
        alt="Logo"
        className="toolbar-logo"
       />
    </div>

    </div>

    <div className="bottom-toolbar">

      <button
        className={`apply-button ${selectedRow ? "active" : ""}`}
        onClick={() => {
          console.log("Aplicar visualização única");

          if(selectedRow){
            console.log("Linha atualmente selecionada:");
            console.log(selectedRow);
          }else{
            console.log("Nenhuma linha selecionada");
          }
        }}
      >
        Aplicar visualização única
      </button>

      <button
        className="clear-button"
        onClick={() => {

          gridRef.current.api.deselectAll();

          setSelectedRow(null);

          console.log("Seleções limpas");

        }}
      >
        Limpar seleções
      </button>

    </div>


    <div className="dadcontainer">

      <div className="table-container">

        <VersionGrid
          data={data}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          gridRef={gridRef}
        />

      </div>

    </div>

  </div>
)

}

export default PaxTable;

