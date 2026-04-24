import {useEffect, useState} from "react" // useState serve para guardar dados que mudam na tela,
                                        //   useEffetc serve para executar algo automaticamente
import {getVersions} from "../services/api.js"
import Header from "../components/Header";

function Home(){
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        const fetchData = async () => {
        const res = await getVersions(search);

        console.log("RES:", res);        // 👀
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
            <input placeholder="Digite sua busca..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}/>
            <input className="chaves" placeholder="Quantidade de chaves" />
            <button>+ Filtros</button>
        </div>

        <div className="dadcontainer">
            <div className="table-container">
            <table className="table">
                <thead>
                <tr>
                    <th>Empresa</th>
                    <th>Equipamento</th>
                    <th>Modelo</th>
                    <th>Versão SO</th>
                    <th>Firmware</th>
                    <th>PUK CRC</th>
                    <th>Aplicação</th>
                    <th>Versão App</th>
                    <th>BT</th>
                    <th>WiFi</th>
                    <th>GPRS</th>
                    <th>Logo</th>
                    <th>Chaves</th>
                    <th>Qtd</th>
                    <th>Configurador</th>
                    <th>Fonte</th>
                    <th>Tipo Chaves</th>
                </tr>
                </thead>

                <tbody>
                {data?.map((item) => (
                    <tr
                    key={item.id}>
                    <td>{item.empresa}</td>
                    <td>{item.equipamento}</td>
                    <td>{item.modelo}</td>
                    <td>{item.versao_so}</td>
                    <td>{item.firmware}</td>
                    <td>{item.puk_crc}</td>
                    <td>{item.aplicacao}</td>
                    <td>{item.versao_app}</td>
                    <td>{item.versao_bt}</td>
                    <td>{item.versao_wifi}</td>
                    <td>{item.versao_gprs}</td>
                    <td>{item.possui_logo ? "Sim" : "Não"}</td>
                    <td>{item.chaves ? "Sim" : "Não"}</td>
                    <td>{item.qtd_chaves}</td>
                    <td>{item.configurador}</td>
                    <td>{item.fonte}</td>
                    <td>{item.tipo_chaves}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    </div>
    )
}

export default Home;

