import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ChaveConfig = sequelize.define("ChaveConfig", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  qtd_dukpt: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  qtd_master_key: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default ChaveConfig;
