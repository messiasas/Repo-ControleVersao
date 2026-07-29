import VersionControl from "./VersionControl.js";
import AplicacaoVersao from "./AplicacaoVersao.js";
import ChaveVersao from "./ChaveVersao.js";
import ChaveConfig from "./ChaveConfig.js";
import Log from "./Logs.js";
import User from "./User.js";

VersionControl.hasMany(AplicacaoVersao, { foreignKey: "version_control_id", as: "aplicacoes" });
AplicacaoVersao.belongsTo(VersionControl, { foreignKey: "version_control_id" });

VersionControl.hasMany(ChaveVersao, { foreignKey: "version_control_id", as: "chaves" });
ChaveVersao.belongsTo(VersionControl, { foreignKey: "version_control_id" });

Log.belongsTo(User, { foreignKey: "user_id", as: "user" });

export { VersionControl, AplicacaoVersao, ChaveVersao, ChaveConfig, Log, User };
