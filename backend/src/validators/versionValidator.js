import Joi from "joi";

export const versionUpdateSchema = Joi.object({
  empresa: Joi.string().optional(),
  equipamento: Joi.string().optional(),
  modelo: Joi.string().optional(),
  versao_so: Joi.string().optional().allow(""),
  firmware: Joi.string().optional().allow(""),
  puk_crc: Joi.string().optional().allow(""),
  aplicacao: Joi.string().optional().allow(""),
  versao_app: Joi.string().optional().allow(""),
  versao_bt: Joi.string().optional().allow(""),
  versao_wifi: Joi.string().optional().allow(""),
  versao_gprs: Joi.string().optional().allow(""),
  possui_logo: Joi.string().valid("SIM", "NÃO").optional().allow(""),
  chaves: Joi.string().optional().allow(""),
  qtd_chaves: Joi.number().integer().optional().allow(null),
  configurador: Joi.string().optional().allow(""),
  fonte: Joi.string().optional().allow(""),
  tipo_chaves: Joi.string().optional().allow(""),
});

export const versionSchema = Joi.object({
  empresa: Joi.string().required(),
  equipamento: Joi.string().required(),
  modelo: Joi.string().required(),

  versao_so: Joi.string().optional(),
  firmware: Joi.string().optional(),
  puk_crc: Joi.string().optional(),

  aplicacao: Joi.string().optional(),
  versao_app: Joi.string().optional(),
  versao_bt: Joi.string().optional(),

  versao_wifi: Joi.string().optional(),
  versao_gprs: Joi.string().optional(),
  possui_logo: Joi.string().valid("SIM", "NÃO").optional().allow(""),

  chaves: Joi.string().optional().allow(""),
  qtd_chaves: Joi.number().integer().optional(),
  configurador: Joi.string().optional(),

  fonte: Joi.string().optional(),
  tipo_chaves: Joi.string().optional(),
});