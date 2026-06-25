import { useEffect, useState } from "react";
import "../styles/VersionView.css";

function VersionView() {

    const [versionData, setVersionData] = useState(null);
    const [appsMode, setAppsMode] = useState("grade");

    useEffect(() => {

        const data = localStorage.getItem("selectedVersion");

        console.log("Dados recebidos:");

        const parsedData = JSON.parse(data);

        console.log(parsedData);

        setVersionData(parsedData);

    }, []);

    return (
    <div className="version-container">

        <div className="info-card">
            <h2>Empresa</h2>

            <div className="info-row">
                <span className="info-value">{versionData?.empresa}</span>
            </div>

            <div className="info-row">
                <span className="info-label">Chaves</span>
                <span className="info-value">
                    {versionData?.chaves ? "Sim" : "Não"}
                </span>
            </div>

            <div className="info-row">
                <span className="info-label">Qtd chaves</span>
                <span className="info-value">
                    {versionData?.qtd_chaves}
                </span>
            </div>

        </div>

        <div className="info-card">

            <h2>Equipamento</h2>

            <div className="info-row">
                <span className="info-label">Modelo</span>
                <span className="info-value">{versionData?.modelo}</span>
            </div>

            <div className="info-row">
                <span className="info-label">Tipo</span>
                <span className="info-value">{versionData?.equipamento}</span>
            </div>

        </div>

        <div className="info-card">

            <h2>Info. versões</h2>

            <div className="info-row">
                <span className="info-label">Versão SO</span>
                <span className="info-value">{versionData?.versao_so}</span>
            </div>

            <div className="info-row">
                <span className="info-label">Firmware</span>
                <span className="info-value">{versionData?.firmware}</span>
            </div>

            <div className="apps-section">
                <div className="apps-header">
                    <span className="info-label">Aplicações</span>
                    {versionData?.aplicacoes?.length > 0 && (
                        <div className="apps-toggle">
                            <button
                                className={`toggle-btn${appsMode === "texto" ? " active" : ""}`}
                                onClick={() => setAppsMode("texto")}
                            >Texto</button>
                            <button
                                className={`toggle-btn${appsMode === "grade" ? " active" : ""}`}
                                onClick={() => setAppsMode("grade")}
                            >Grade</button>
                        </div>
                    )}
                </div>
                {versionData?.aplicacoes?.length > 0 ? (
                    appsMode === "grade" ? (
                        <div className="apps-table-wrapper">
                            <table className="apps-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nome</th>
                                        <th>Versão</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {versionData.aplicacoes.map((a, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{a.nome || "—"}</td>
                                            <td>{a.versao || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <ul className="apps-text-list">
                            {versionData.aplicacoes.map((a, i) => (
                                <li key={i}>{a.nome || "—"} - {a.versao || "—"}</li>
                            ))}
                        </ul>
                    )
                ) : <span className="info-value">—</span>}
            </div>

            <div className="info-row">
                <span className="info-label">Configurador</span>
                <span className="info-value">{versionData?.configurador}</span>
            </div>

        </div>

        <div className="info-card">

            <h2>Conectividade</h2>

            <div className="info-row">
                <span className="info-label">Bluetooth</span>
                <span className="info-value">{versionData?.versao_bt}</span>
            </div>

            <div className="info-row">
                <span className="info-label">Wi-Fi</span>
                <span className="info-value">{versionData?.versao_wifi}</span>
            </div>

            <div className="info-row">
                <span className="info-label">GPRS</span>
                <span className="info-value">{versionData?.versao_gprs}</span>
            </div>

        </div>

        <div className="info-card">

            <h2>Info. chaves</h2>

            <div className="info-row">
                <span className="info-label">Chaves</span>
                <span className="info-value">
                    {versionData?.chaves ? "Sim" : "Não"}
                </span>
            </div>

            <div className="info-row">
                <span className="info-label">Qtd chaves</span>
                <span className="info-value">
                    {versionData?.qtd_chaves}
                </span>
            </div>

            <div className="info-row">
                <span className="info-label">Tipo</span>
                <span className="info-value">
                    {versionData?.tipo_chaves}
                </span>
            </div>

            <div className="info-row">
                <span className="info-label">PUK CRC</span>
                <span className="info-value">
                    {versionData?.puk_crc}
                </span>
            </div>

        </div>

        <div className="info-card">

            <h2>Personalização</h2>

            <div className="info-row">
                <span className="info-label">Possui Logo</span>
                <span className="info-value">
                    {versionData?.possui_logo ? "Sim" : "Não"}
                </span>
            </div>

            <div className="info-row">
                <span className="info-label">Fonte</span>
                <span className="info-value">
                    {versionData?.fonte}
                </span>
            </div>

        </div>
    
        <div className="info-card">

            <h2>Histórico</h2>

            <div className="info-row">
                <span className="info-label">Possui Logo</span>
                <span className="info-value">
                    {versionData?.possui_logo ? "Sim" : "Não"}
                </span>
            </div>

            <div className="info-row">
                <span className="info-label">Fonte</span>
                <span className="info-value">
                    {versionData?.fonte}
                </span>
            </div>

        </div>

    </div>
    );
}

export default VersionView;