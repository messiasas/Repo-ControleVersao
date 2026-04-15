import Joi from "joi";

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
  possui_logo: Joi.boolean().optional(),

  chaves: Joi.boolean().optional(),
  qtd_chaves: Joi.number().integer().optional(),
  configurador: Joi.string().optional(),

  fonte: Joi.string().optional(),
  tipo_chaves: Joi.string().optional(),

  data_criacao: Joi.date().optional()
});