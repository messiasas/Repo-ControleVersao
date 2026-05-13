import {useEffect, useState} from "react" // useState serve para guardar dados que mudam na tela,
                                        //   useEffetc serve para executar algo automaticamente
import {getVersions} from "../services/api.js"
import Header from "../components/Header.jsx";
import VersionGrid from "../components/VersionGrid.jsx";

function PaxTable(){
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

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

    <div className="toolbar">

      <input
        placeholder="Digite sua busca..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        className="chaves"
        placeholder="Quantidade de chaves"
      />

      <button>+ Filtros</button>

    </div>

    <div className="dadcontainer">

      <div className="table-container">

        <VersionGrid data={data} />

      </div>

    </div>

  </div>
)

}

export default PaxTable;

