import VersionControl from "./VersionControl.js";
import AplicacaoVersao from "./AplicacaoVersao.js";
import Log from "./Logs.js";
import User from "./User.js";

VersionControl.hasMany(AplicacaoVersao, { foreignKey: "version_control_id", as: "aplicacoes" });
AplicacaoVersao.belongsTo(VersionControl, { foreignKey: "version_control_id" });

Log.belongsTo(User, { foreignKey: "user_id", as: "user" });

export { VersionControl, AplicacaoVersao, Log, User };
