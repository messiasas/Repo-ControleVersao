import * as repo from "../repositories/versionRepository.js";
import VersionControl from "../models/VersionControl.js";
import { createLog} from "./logServices.js";

export const getAll = async({page, limit}) => {

    const offset = (page - 1) * limit;
    const { count, rows } = await VersionControl.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    });

    return {
    data: rows,
    total: count,
    page: Number(page),
    totalPages: Math.ceil(count / limit),
    };
};

export const create = async(data, userId) => {
    const record = await repo.create(data);
    
    await createLog(userId, "CREATE", record.id);

    return record;
};
