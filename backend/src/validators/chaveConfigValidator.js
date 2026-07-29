import Joi from "joi";

export const chaveConfigSchema = Joi.object({
  nome: Joi.string().required(),
  qtd_dukpt: Joi.number().integer().min(0).optional().allow(null),
  qtd_master_key: Joi.number().integer().min(0).optional().allow(null),
});

export const chaveConfigUpdateSchema = Joi.object({
  nome: Joi.string().optional(),
  qtd_dukpt: Joi.number().integer().min(0).optional().allow(null),
  qtd_master_key: Joi.number().integer().min(0).optional().allow(null),
});
