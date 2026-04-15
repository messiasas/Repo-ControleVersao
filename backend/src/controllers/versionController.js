import * as service from "../services/versionServices.js";

export const getAll = async(req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const result = await service.getAll({page: Number(page),limit: Number(limit)});

        return res.json(result);
    }catch (error){
        return res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    const data = await service.create(req.body, req.user.id);
    res.status(201).json(data);
}