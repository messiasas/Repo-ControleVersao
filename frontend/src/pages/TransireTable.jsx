import {useEffect, useState} from "react" 
import {getVersions} from "../services/api.js"
import Header from "../components/Header.jsx";
import Filters from "../components/Filters.jsx"
import Grid from "../components/Grid.jsx"


function TransireTable(){
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

      <Filters
        search={search}
        setSearch={setSearch}
      />

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

          }}>
          Aplicar visualização única
        </button>

      </div>

      <Grid
        data={data}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />

    </div>
)}

export default TransireTable;

