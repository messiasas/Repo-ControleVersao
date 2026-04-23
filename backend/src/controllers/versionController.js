import * as service from "../services/versionServices.js";

export const getAll = async(req, res) => {
    try {
        const { page = 1, limit, sort, order, ...filters } = req.query;

            /*
      filters agora contém QUALQUER filtro vindo da URL

      Exemplo:
      GET /versions?empresa=XPTO&modelo=ABC

      filters = {
        empresa: "XPTO",
        modelo: "ABC"
      }
    */

        const result = await service.getAll({
            page: Number(page),
            limit: limit ? Number(limit) : null,
            sort,
            order,
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
}