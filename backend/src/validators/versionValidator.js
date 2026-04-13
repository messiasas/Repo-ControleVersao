import Joi from "joi";

export const versionSchema = Joi.object({
    empresa: Joi.string().required(),
    equipamento: Joi.string().required(),
    modelo: Joi.string().required(),
    versao_so: Joi.string().required()
});