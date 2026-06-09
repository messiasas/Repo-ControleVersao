import HeaderAmazonas from "../components/HeaderAmazonas.jsx";
import FiltersAmazonas from "../components/FiltersAmazonas.jsx";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {getVersions} from "../services/api.js";

import GridAmazonas from "../components/GridAmazonas.jsx"


function Admin() {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);


    useEffect(() => {

        const delayDebounce = setTimeout(() => {
        const fetchData = async () => {
        const res = await getVersions(search);

        setData([...res.data]);
    };

    fetchData();
    }, 500);

    return () => clearTimeout(delayDebounce);
    }, [search]);

    console.log(data);

    const navigate = useNavigate();

    return(
        <div className="app-container">
        <HeaderAmazonas />

        <div className="top-navigation-amazonas">

        <button className="nav-button-amazonas active">
          Controle de versão
        </button>

        <button 
          className="nav-button-amazonas">

          Adicionar usuário
        </button>

        <button className="nav-button-amazonas">
          Histórico
        </button>

        </div>
        <FiltersAmazonas
        search={search}
        setSearch={setSearch}
        />

      <GridAmazonas
        data={data}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />

      <div className="bottom-toolbar">

        <button
          className={`apply-button ${selectedRow ? "active" : ""}`}
          onClick={() => {
          console.log("Aplicar visualização única");

            if(selectedRow){
              console.log("Linha atualmente selecionada:");
              console.log(selectedRow);

            // MVP soluction
            localStorage.setItem(
              "selectedVersion",
              JSON.stringify(selectedRow)
            );

            window.open(
              "/version-view",
              "_blank"
            );
            }else{
              console.log("Nenhuma linha selecionada");
            }
          }}>
          Aplicar visualização única
        </button>

      </div>
    </div>
    )
}

export default Admin;