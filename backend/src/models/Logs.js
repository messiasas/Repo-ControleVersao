import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Log = sequelize.define("Log", {
  user_id: DataTypes.INTEGER,
  action: DataTypes.STRING,
  record_id: DataTypes.INTEGER
});

export default Log;