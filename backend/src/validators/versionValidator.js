import Joi from "joi";

const aplicacaoItem = Joi.object({
  nome: Joi.string().optional().allow(""),
  versao: Joi.string().optional().allow(""),
});

export const versionUpdateSchema = Joi.object({
  empresa: Joi.string().optional(),
  equipamento: Joi.string().optional(),
  modelo: Joi.string().optional(),
  versao_so: Joi.string().optional().allow(""),
  firmware: Joi.string().optional().allow(""),
  puk_crc: Joi.string().optional().allow(""),
  versao_bt: Joi.string().optional().allow(""),
  versao_wifi: Joi.string().optional().allow(""),
  versao_gprs: Joi.string().optional().allow(""),
  possui_logo: Joi.string().valid("SIM", "NÃO").optional().allow(""),
  chaves: Joi.string().optional().allow(""),
  qtd_chaves: Joi.number().integer().optional().allow(null),
  configurador: Joi.string().optional().allow(""),
  fonte: Joi.string().optional().allow(""),
  tipo_chaves: Joi.string().optional().allow(""),
  aplicacoes: Joi.array().items(aplicacaoItem).optional(),
});

export const versionSchema = Joi.object({
  empresa: Joi.string().required(),
  equipamento: Joi.string().required(),
  modelo: Joi.string().required(),
  versao_so: Joi.string().optional().allow(""),
  firmware: Joi.string().optional().allow(""),
  puk_crc: Joi.string().optional().allow(""),
  versao_bt: Joi.string().optional().allow(""),
  versao_wifi: Joi.string().optional().allow(""),
  versao_gprs: Joi.string().optional().allow(""),
  possui_logo: Joi.string().valid("SIM", "NÃO").optional().allow(""),
  chaves: Joi.string().optional().allow(""),
  qtd_chaves: Joi.number().integer().optional().allow(null),
  configurador: Joi.string().optional().allow(""),
  fonte: Joi.string().optional().allow(""),
  tipo_chaves: Joi.string().optional().allow(""),
  aplicacoes: Joi.array().items(aplicacaoItem).optional(),
});
