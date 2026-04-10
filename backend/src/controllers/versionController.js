import * as service from "../services/versionServices.js";


// Exporta uma função chamada getAll (usada nas rotas)
// async = permite usar await dentro dela
export const getAll = async(req, res) => {

    // Chama o service para buscar todos os dados no banco
    // await espera a resposta antes de continuar
    const data = await service.getAll();
    res.json(data);
};

export const create = async (req, res) => {
    const data = await service.create(req.body); // recebe requisição
    res.status(201).json(data); // envia resposta
}