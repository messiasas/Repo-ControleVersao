import VersionControl from "./VersionControl.js";
import AplicacaoVersao from "./AplicacaoVersao.js";

VersionControl.hasMany(AplicacaoVersao, { foreignKey: "version_control_id", as: "aplicacoes" });
AplicacaoVersao.belongsTo(VersionControl, { foreignKey: "version_control_id" });

export { VersionControl, AplicacaoVersao };
