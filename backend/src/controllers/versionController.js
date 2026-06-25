import * as service from "../services/versionServices.js";

export const getAll = async(req, res) => {
    console.log("QUERY RECEBIDA:", req.query);
    try {
        const { page = 1, limit, sort, order, search, ...filters } = req.query;

        const result = await service.getAll({
            page: Number(page),
            limit: limit ? Number(limit) : null,
            sort,
            order,
            search,
            filters
        }); // O filter passa tudo de forma dinamica

        return res.json(result);
    }catch (error){
        return res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    const data = await service.create(req.body, req.user.id);
    res.status(201).json(data);
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await service.update(id, req.body, req.user.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await service.remove(id);
        res.json({ message: "Pacote excluído com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};