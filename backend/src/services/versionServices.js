import * as repo from "../repositories/versionRepository.js";
import { VersionControl, AplicacaoVersao, ChaveVersao } from "../models/index.js";
import { createLog } from "./logServices.js";
import { Op, fn, col, where as sequelizeWhere } from "sequelize";

const allowedFilters = ["empresa", "equipamento", "versao_so", "plataforma"];
const allowedSortFields = ["empresa", "modelo", "versao_so", "createdAt"];

const searchableFields = ["empresa", "modelo", "versao_so", "plataforma"];

export const getAll = async ({ page, limit, sort, order, search, filters }) => {
  const where = {};
  const otherFilters = filters || {};

  console.log("SEARCH RECEBIDO:", search);

  const parsedLimit = Number(limit);
  const safeLimit = parsedLimit ? Math.min(parsedLimit, 1000) : null;
  const safePage = Math.max(Number(page) || 1, 1);

  for (const key in otherFilters) {
    if (!allowedFilters.includes(key)) continue;

    const value = otherFilters[key];
    if (!value || !String(value).trim()) continue;

    if (key === "versao_so") {
      where[key] = String(value);
    } else {
      where[key] = { [Op.like]: `${value}%` };
    }
  }

  if (search && String(search).trim()) {
    const normalizedSearch = search.trim().toLowerCase();

    where[Op.or] = searchableFields.map((field) =>
      sequelizeWhere(fn("LOWER", col(field)), { [Op.like]: `%${normalizedSearch}%` })
    );
  }

  const sortField = allowedSortFields.includes(sort) ? sort : "createdAt";
  const sortOrder = order === "DESC" ? "DESC" : "ASC";
  const orderClause = [[sortField, sortOrder]];
  const offset = safeLimit ? (safePage - 1) * safeLimit : 0;

  console.log("WHERE FINAL:", JSON.stringify(where, null, 2));

  const [count, rows] = await Promise.all([
    VersionControl.count({ where }),
    VersionControl.findAll({
      where,
      order: orderClause,
      ...(safeLimit ? { limit: safeLimit, offset } : {}),
      include: [
        { model: AplicacaoVersao, as: "aplicacoes" },
        { model: ChaveVersao, as: "chaves" },
      ],
    }),
  ]);

  return {
    data: rows,
    meta: {
      totalItems: count,
      itemCount: rows.length,
      itemsPerPage: safeLimit,
      totalPages: safeLimit ? Math.ceil(count / safeLimit) : 1,
      currentPage: safePage,
    },
  };
};

export const create = async (data, userId) => { // criar o registro e também gerar um log de auditoria
  const record = await repo.create(data);
  await createLog(userId, "CREATE", record.id, record.toJSON());
  return record;
};

export const update = async (id, data, userId) => {
  await repo.update(id, data);
  const updated = await repo.findById(id);
  await createLog(userId, "UPDATE", id, updated.toJSON());
  return updated;
};

export const remove = async (id, userId) => {
  const record = await repo.findById(id);
  await createLog(userId, "DELETE", id, record ? record.toJSON() : null);
  await repo.remove(id);
};

export const getDistinctChaves = async () => {
  const rows = await ChaveVersao.findAll({
    attributes: [[fn("DISTINCT", col("chave")), "chave"]],
    where: { chave: { [Op.ne]: null } },
    order: [["chave", "ASC"]],
    raw: true,
  });
  return rows.map((r) => r.chave).filter((c) => c && c.trim());
};

export const getDistinctPlataformas = async () => {
  const rows = await VersionControl.findAll({
    attributes: [[fn("DISTINCT", col("plataforma")), "plataforma"]],
    where: { plataforma: { [Op.ne]: null } },
    order: [["plataforma", "ASC"]],
    raw: true,
  });
  return rows.map((r) => r.plataforma).filter((p) => p && p.trim());
};
