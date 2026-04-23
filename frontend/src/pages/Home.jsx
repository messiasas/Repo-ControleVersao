import {useEffect, useState} from "react" // useState serve para guardar dados que mudam na tela,
                                        //   useEffetc serve para executar algo automaticamente
import {getVersions} from "../services/api.js"
import Header from "../components/Header";

function Home(){
    const [data, setData] = useState([]);

      // 🔥 AQUI
    /*const getRowColor = (empresa) => {
        const colors = {
        PAGSEGURO: "#d6eaff",
        CIELO: "#ffe6e6",
        STONE: "#e6ffe6",
        REDE: "#fff5cc"
        };

    return colors[empresa?.toUpperCase()] || "#ffffff";
    };*/

    useEffect(() => {
        const fetchData = async () => {
            const res = await getVersions(); // GET /versions
            setData(res.data);
        };

    fetchData();
    }, []); // execute assim que abrir a tela

    console.log(data);
    return (
    
    <div className="app-container">
        <Header />

        <div className="toolbar">
            <input placeholder="Digite sua busca..." />
            <input className="chaves" placeholder="Quantidade de chaves" />
            <button>+ Filtros</button>
        </div>

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
    )
}

export default Home;

