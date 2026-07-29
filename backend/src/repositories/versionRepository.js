import { VersionControl, AplicacaoVersao, ChaveVersao } from "../models/index.js";

const INCLUDE_ALL = [
  { model: AplicacaoVersao, as: "aplicacoes" },
  { model: ChaveVersao, as: "chaves" },
];

export const create = async (data) => {
  const { aplicacoes = [], chaves = [], ...versionData } = data;
  const record = await VersionControl.create(versionData);

  const validApps = aplicacoes.filter((a) => a.nome || a.versao);
  if (validApps.length > 0) {
    await AplicacaoVersao.bulkCreate(
      validApps.map((a) => ({ version_control_id: record.id, nome: a.nome || "", versao: a.versao || "" }))
    );
  }

  const validChaves = chaves.filter((c) => c.chave);
  if (validChaves.length > 0) {
    await ChaveVersao.bulkCreate(
      validChaves.map((c) => ({ version_control_id: record.id, chave: c.chave }))
    );
  }

  return findById(record.id);
};

export const findAll = () => VersionControl.findAll({ include: INCLUDE_ALL });

export const findById = (id) => VersionControl.findByPk(id, { include: INCLUDE_ALL });

export const update = async (id, data) => {
  const { aplicacoes, chaves, ...versionData } = data;

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

  if (chaves !== undefined) {
    await ChaveVersao.destroy({ where: { version_control_id: id } });
    const valid = chaves.filter((c) => c.chave);
    if (valid.length > 0) {
      await ChaveVersao.bulkCreate(
        valid.map((c) => ({ version_control_id: id, chave: c.chave }))
      );
    }
  }
};

export const remove = (id) => VersionControl.destroy({ where: { id } });
