import { ChaveConfig, ChaveConfigLog, ChaveVersao, VersionControl, User } from "../models/index.js";
import { createLog } from "./logServices.js";
import * as versionRepo from "../repositories/versionRepository.js";

export const getAll = () => ChaveConfig.findAll({ order: [["nome", "ASC"]] });

export const getLogs = () =>
  ChaveConfigLog.findAll({
    order: [["createdAt", "DESC"]],
    limit: 50,
    include: [{ model: User, as: "user", attributes: ["email"] }],
  });

const createChaveLog = (userId, action, chaveConfigId, details) =>
  ChaveConfigLog.create({
    user_id: userId,
    action,
    chave_config_id: chaveConfigId,
    details: details ? JSON.stringify(details) : null,
  });

// Quando a config de uma chave muda, todos os pacotes que já usam essa chave
// precisam ter a quantidade de chaves recalculada, e essa recalculagem entra
// no histórico do próprio pacote (mesmo fluxo usado em qualquer outra edição).
const propagateToPackages = async (nome, userId) => {
  const usos = await ChaveVersao.findAll({ where: { chave: nome }, attributes: ["version_control_id"] });
  const versionIds = [...new Set(usos.map((u) => u.version_control_id))];
  if (versionIds.length === 0) return;

  const configs = await ChaveConfig.findAll();
  const configMap = new Map(configs.map((c) => [c.nome, c]));

  for (const versionId of versionIds) {
    const chaves = await ChaveVersao.findAll({ where: { version_control_id: versionId } });
    const qtd_chaves = chaves.reduce((sum, c) => {
      const config = configMap.get(c.chave);
      return sum + (config ? (Number(config.qtd_dukpt) || 0) + (Number(config.qtd_master_key) || 0) : 0);
    }, 0);

    await VersionControl.update({ qtd_chaves }, { where: { id: versionId } });
    const updated = await versionRepo.findById(versionId);
    if (updated) {
      await createLog(userId, "UPDATE", versionId, updated.toJSON());
    }
  }
};

export const create = async (data, userId) => {
  const chave = await ChaveConfig.create({
    nome: data.nome.trim().toUpperCase(),
    qtd_dukpt: data.qtd_dukpt ?? 0,
    qtd_master_key: data.qtd_master_key ?? 0,
  });
  await createChaveLog(userId, "CREATE", chave.id, chave.toJSON());
  return chave;
};

export const update = async (id, data, userId) => {
  const before = await ChaveConfig.findByPk(id);
  if (!before) return null;
  const oldNome = before.nome;

  const normalized = data.nome !== undefined ? { ...data, nome: data.nome.trim().toUpperCase() } : data;
  await ChaveConfig.update(normalized, { where: { id } });
  const updated = await ChaveConfig.findByPk(id);

  await createChaveLog(userId, "UPDATE", id, { before: before.toJSON(), after: updated.toJSON() });

  if (updated.nome !== oldNome) {
    await ChaveVersao.update({ chave: updated.nome }, { where: { chave: oldNome } });
  }

  await propagateToPackages(updated.nome, userId);

  return updated;
};

export const remove = async (id, userId) => {
  const chave = await ChaveConfig.findByPk(id);
  if (!chave) return;

  await createChaveLog(userId, "DELETE", id, chave.toJSON());
  await ChaveConfig.destroy({ where: { id } });
  await propagateToPackages(chave.nome, userId);
};
