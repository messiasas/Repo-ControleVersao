import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VersionControl = sequelize.define("VersionControl",
{
    empresa: DataTypes.STRING,
    equipamento: DataTypes.STRING,
    modelo: DataTypes.STRING,

    versao_so: DataTypes.STRING,
    firmware: DataTypes.STRING,
    puk_crc: DataTypes.STRING,

    aplicacao: DataTypes.STRING,
    versao_app: DataTypes.STRING,
    versao_bt: DataTypes.STRING,

    versao_wifi: DataTypes.STRING,
    versao_gprs: DataTypes.STRING,
    possui_logo: DataTypes.BOOLEAN,

    chaves: DataTypes.BOOLEAN,
    qtd_chaves: DataTypes.INTEGER,
    configurador: DataTypes.STRING,
    
    fonte: DataTypes.STRING,
    tipo_chaves: DataTypes.STRING,
    data_criacao: DataTypes.DATE
});

export default VersionControl;