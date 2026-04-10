import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"

const User = sequelize.define("User",     
{
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: DataTypes.STRING,
    role: {
        type: DataTypes.STRING,
        defaultValue: "admin"
    }
});