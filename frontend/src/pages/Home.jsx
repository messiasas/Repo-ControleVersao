import {useEffect, useState} from "react" // useState serve para guardar dados que mudam na tela,
                                        //   useEffetc serve para executar algo automaticamente
import {getVersions} from "../services/api.js"
import Header from "../components/Header";

function Home(){
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getVersions(); // GET /versions
            setData(res.data);
        };

    fetchData();
    }, []); // execute assim que abrir a tela
    console.log(data);
    return (
        <div>
            <Header />
            <div style={{ padding: "16px" }}>
                <p>Conteúdo da página...</p>
            </div>

            {data.map((item) => (
                <div key={item.id}>
                    {item.empresa} - {item.modelo} - {item.versao_so}
                </div>
            ))}
        </div>
    )
}

export default Home;

