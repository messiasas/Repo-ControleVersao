import {Sequelize} from "sequelize";
import { Op, fn, col, where as sequelizeWhere } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // take configs insert on .env file

const sequelize = new Sequelize({
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,

    dialect: "mysql",
    logging: console.log, /* Usamos para depurar cada requição feita na aplicação, como a busca de um registro */
                        /* Podemos ver esses logs no cmd assim quando buscamos algo, como por exemplo  SELECT `id`, `pacote`, `equipamento`, ... FROM `VersionControls` AS `VersionControl` WHERE ... */
                        /* Podemos fazer uma alteração no futuro para nao termos esses logs em produção, podendo usar somente quando no perfil de dev */
    },
);

export default sequelize;