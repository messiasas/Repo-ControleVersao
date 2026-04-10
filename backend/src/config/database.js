import {Sequelize} from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // take configs insert on .env file

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log,
    },
);

export default sequelize;