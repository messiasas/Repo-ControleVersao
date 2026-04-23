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

    const parsedLimit = Number(limit);
    const safeLimit = parsedLimit ? Math.min(parsedLimit, 1000) : null;

    const safePage = Math.max(Number(page) || 1, 1);

    for(const key in filters || {}){
        if(!allowedFilters.includes(key)) continue; // perminte filtros definidos, evitando ataques diretos ao banco como "DROP DATABASE"

        const value = filters[key];
        if (!value || !String(value).trim()) continue; // Remove espaços (!String(value).trim())

        if (key === "versao_so") {
            where[key] = String(value);
            } else {
            where[key] = {
                // O usuário espera busca por “começa com” ou “contém”?
                [Op.like]: `${value}%` // risco também
            }; 
        };
    }
                                                                // sort (portugues: classificar) é o campo que queremos ordenar, por exemplo ?sort=empresa - isto é ordenar pelos nomes das empresas
    const sortField = allowedSortFields.includes(sort) ? sort: "createdAt"; //Se o campo enviado é válido, usa ele. Senão, usa createdAt, createdAt é para "Mais recente primeiro" caso o user nao especifique
    const sortOrder = order === "DESC" ? "DESC" : "ASC"; // ordem descendente, se for algo invalido -> ASC (ascendente)

    const orderClause = [[sortField, sortOrder]]; // orderClause [[classificar=empresas, orderm=crescente]] -> MySQL -> ORDER BY empresa ASC

    const offset = safeLimit ? (safePage - 1) * safeLimit : 0;

    const queryOptions  = {
    where,
    order: orderClause
    };

    if (safeLimit) {
        queryOptions.limit = safeLimit;
        queryOptions.offset = offset;
    }
    const { count, rows } = await VersionControl.findAndCountAll(queryOptions);

    return {
    data: rows,
    meta: {
        totalItems: count, // totalItems": 100,
        itemCount: rows.length, // "itemCount": 10,
        itemsPerPage: safeLimit, // "itemsPerPage": 10,
        totalPages: Math.ceil(count/ safeLimit), // "totalPages": 10,
        currentPage: safePage //"currentPage": 1
    }
    };
};

export const create = async(data, userId) => {
    const record = await repo.create(data);
    
    await createLog(userId, "CREATE", record.id);

    return record;
};
