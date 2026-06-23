import * as repo from "../repositories/versionRepository.js";
import { VersionControl, AplicacaoVersao } from "../models/index.js";
import { createLog } from "./logServices.js";
import { Op, fn, col, where as sequelizeWhere } from "sequelize";

const allowedFilters = ["empresa", "modelo", "versao_so"];
const allowedSortFields = ["empresa", "modelo", "versao_so", "createdAt"];

const searchableFields = ["empresa", "modelo", "versao_so"];

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
      include: [{ model: AplicacaoVersao, as: "aplicacoes" }],
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

export const create = async (data, userId) => {
  const record = await repo.create(data);
  await createLog(userId, "CREATE", record.id);
  return record;
};

export const update = async (id, data, userId) => {
  await repo.update(id, data);
  await createLog(userId, "UPDATE", id);
  return repo.findById(id);
};
