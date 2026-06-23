import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AplicacaoVersao = sequelize.define("AplicacaoVersao", {
  version_control_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nome: DataTypes.STRING,
  versao: DataTypes.STRING,
});

export default AplicacaoVersao;
