import * as service from "../services/chaveConfigServices.js";

export const getAll = async (req, res) => {
    try {
        const chaves = await service.getAll();
        res.json(chaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const chave = await service.create(req.body);
        res.status(201).json(chave);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const chave = await service.update(id, req.body);
        res.json(chave);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await service.remove(id);
        res.json({ message: "Chave excluída com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
