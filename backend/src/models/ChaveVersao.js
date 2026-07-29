import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ChaveVersao = sequelize.define("ChaveVersao", {
  version_control_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  chave: DataTypes.STRING,
});

export default ChaveVersao;
