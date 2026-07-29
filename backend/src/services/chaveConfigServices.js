import { ChaveConfig } from "../models/index.js";

export const getAll = () => ChaveConfig.findAll({ order: [["nome", "ASC"]] });

export const create = (data) =>
  ChaveConfig.create({
    nome: data.nome,
    qtd_dukpt: data.qtd_dukpt ?? 0,
    qtd_master_key: data.qtd_master_key ?? 0,
  });

export const update = async (id, data) => {
  await ChaveConfig.update(data, { where: { id } });
  return ChaveConfig.findByPk(id);
};

export const remove = (id) => ChaveConfig.destroy({ where: { id } });
