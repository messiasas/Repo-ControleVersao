import sequelize from "../config/database.js";
import { VersionControl, AplicacaoVersao } from "../models/index.js";

await sequelize.authenticate();

await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
await AplicacaoVersao.truncate({ restartIdentity: true });
await VersionControl.truncate({ restartIdentity: true });
await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

console.log("Dados de VersionControl e AplicacaoVersao apagados com sucesso.");
process.exit();
