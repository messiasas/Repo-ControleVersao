import {useEffect, useState} from "react"
import {getVersions} from "../services/api.js"
import TopNav from "../components/TopNav.jsx";
import Filters from "../components/Filters.jsx"
import Grid from "../components/Grid.jsx"
import { openVersionView } from "../utils/openVersionView.js";


function TransireTable(){
    const [data, setData] = useState([]);
    const [filtros, setFiltros] = useState({ pacote: "", equipamento: "", plataforma: "" });
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {

        const delayDebounce = setTimeout(() => {
        const fetchData = async () => {
        const res = await getVersions(filtros);

        setData([...res.data]);
    };

    fetchData();
    }, 500);

    return () => clearTimeout(delayDebounce);
    }, [filtros]);

    console.log(data);

    return (
    <div className="app-container">

      <TopNav />

      <Filters
        filtros={filtros}
        setFiltros={setFiltros}
      />

      <div className="bottom-toolbar bottom-toolbar--single">

        <button
          className={`apply-button ${selectedRow ? "active" : ""}`}
          onClick={() => {
            if (selectedRow) {
              openVersionView(selectedRow);
            }
          }}>
          Visualizar
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

