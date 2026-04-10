import * as repo from "../repositories/versionRepository.js";


/* arquivo responsavel por validar dados, impledir duplicidade, controlar acesso */

/* Esse services ele conversa diretamente com o Controller, ou seja, quando o controler recebe uma requisição getAll por exemplo,
    esse getAll vai agir conforme inserimos as regras aqui!
*/

export const getAll = async() => {
    return await repo.findAll();
};

export const create = async(data) => {
    // Aqui entra validação futuramente
    return await repo.create(data);
};
