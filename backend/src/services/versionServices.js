import * as repo from "../repositories/versionRepository.js";
import VersionControl from "../models/VersionControl.js";
import { createLog} from "./logServices.js";

import {Op} from "sequelize";
//import {Version} from "../models/index.js"

// Quando quiser adicionar novos filtros, é só incluir aqui
const allowedFilters = ["empresa", "modelo", "versao_so"];
const allowedSortFields = ["empresa", "modelo", "versao_so", "createdAt"];

export const getAll = async({page, limit, sort, order, filters}) => {
    // cuidado com LIKE em grandes volumes - Verificar esse ponto

    const where = {};

    const safeLimit = Math.min(Number(limit) || 10, 100);
    const safePage = Math.max(Number(page) || 1, 1);

    for(const key in filters || {}){
        if(!allowedFilters.includes(key)) continue;

        const value = filters[key];
        if (!value || !String(value).trim()) continue;

        if (key === "versao_so") {
            where[key] = String(value);
            } else {
            where[key] = {
                [Op.like]: `%${value}%` // risco também
            }; 
        };
    }

    const sortField = allowedSortFields.includes(sort) ? sort: "createdAt";
    const sortOrder = order === "DESC" ? "DESC" : "ASC";
    const orderClause = [[sortField, sortOrder]];

    const offset = (safePage - 1) * safeLimit;
    const { count, rows } = await VersionControl.findAndCountAll({
    where,
    limit: safeLimit,
    offset,
    order: orderClause
    });

    return {
    data: rows,
    meta: {
        totalItems: count,
        itemCount: rows.length,
        itemsPerPage: safeLimit,
        totalPages: Math.ceil(count/ safeLimit),
        currentPage: safePage
    }
    };
};

export const create = async(data, userId) => {
    const record = await repo.create(data);
    
    await createLog(userId, "CREATE", record.id);

    return record;
};
