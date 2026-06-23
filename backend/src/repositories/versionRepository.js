import { VersionControl, AplicacaoVersao } from "../models/index.js";

const INCLUDE_APLICACOES = [{ model: AplicacaoVersao, as: "aplicacoes" }];

export const create = async (data) => {
  const { aplicacoes = [], ...versionData } = data;
  const record = await VersionControl.create(versionData);

  const valid = aplicacoes.filter((a) => a.nome || a.versao);
  if (valid.length > 0) {
    await AplicacaoVersao.bulkCreate(
      valid.map((a) => ({ version_control_id: record.id, nome: a.nome || "", versao: a.versao || "" }))
    );
  }

  return findById(record.id);
};

export const findAll = () => VersionControl.findAll({ include: INCLUDE_APLICACOES });

export const findById = (id) => VersionControl.findByPk(id, { include: INCLUDE_APLICACOES });

export const update = async (id, data) => {
  const { aplicacoes, ...versionData } = data;

  if (Object.keys(versionData).length > 0) {
    await VersionControl.update(versionData, { where: { id } });
  }

  if (aplicacoes !== undefined) {
    await AplicacaoVersao.destroy({ where: { version_control_id: id } });
    const valid = aplicacoes.filter((a) => a.nome || a.versao);
    if (valid.length > 0) {
      await AplicacaoVersao.bulkCreate(
        valid.map((a) => ({ version_control_id: id, nome: a.nome || "", versao: a.versao || "" }))
      );
    }
  }
};

export const remove = (id) => VersionControl.destroy({ where: { id } });
