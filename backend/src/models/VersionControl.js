import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VersionControl = sequelize.define("VersionControl",
{
    pacote: DataTypes.STRING,
    equipamento: DataTypes.STRING,
    modelo: DataTypes.STRING,
    plataforma: DataTypes.STRING,

    fw: DataTypes.STRING(30),
    sphs: DataTypes.STRING(30),
    firmware_version: DataTypes.STRING(30),

    versao_so: DataTypes.STRING,
    security_version: DataTypes.STRING(100),
    firmware: DataTypes.STRING,
    puk_crc: DataTypes.STRING,

    aplicacao: DataTypes.STRING,
    versao_app: DataTypes.STRING,
    versao_bt: DataTypes.STRING,

    versao_wifi: DataTypes.STRING,
    versao_gprs: DataTypes.STRING,
    possui_logo: DataTypes.STRING,

    qtd_chaves: DataTypes.INTEGER,
    configurador: DataTypes.STRING,
    
    fonte: DataTypes.STRING,
    tipo_chaves: DataTypes.STRING,
    
}, {

    indexes: [
        { name: "idx_pacote", fields: ["pacote"] },
        { name: "idx_modelo", fields: ["modelo"] },
        { name: "idx_versao_so", fields: ["versao_so"] },
        { name: "idx_createdAt", fields: ["createdAt"] }
    ]
});

export default VersionControl;