import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ChaveConfigLog = sequelize.define("ChaveConfigLog", {
  user_id: DataTypes.INTEGER,
  action: DataTypes.STRING,
  chave_config_id: DataTypes.INTEGER,
  details: DataTypes.TEXT,
});

export default ChaveConfigLog;
