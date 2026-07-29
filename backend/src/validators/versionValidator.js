import Joi from "joi";

const aplicacaoItem = Joi.object({
  nome: Joi.string().optional().allow(""),
  versao: Joi.string().optional().allow(""),
});

const chaveItem = Joi.object({
  chave: Joi.string().optional().allow(""),
});

/*  versionUpdateSchema (usado no PUT) tem os mesmos campos, mas todos .optional() — faz sentido porque
uma atualização pode mandar só o campo que mudou, sem precisar reenviar tudo. */

export const versionUpdateSchema = Joi.object({
  empresa: Joi.string().optional(),
  equipamento: Joi.string().optional(),

  modelo: Joi.string().optional(),
  plataforma: Joi.string().optional().allow(""),

  fw: Joi.string().max(30).optional().allow(""),
  sphs: Joi.string().max(30).optional().allow(""),
  firmware_version: Joi.string().max(30).optional().allow(""),

  versao_so: Joi.string().optional().allow(""),
  security_version: Joi.string().max(100).optional().allow(""),

  firmware: Joi.string().optional().allow(""),
  puk_crc: Joi.string().optional().allow(""),

  versao_bt: Joi.string().optional().allow(""),
  versao_wifi: Joi.string().optional().allow(""),

  versao_gprs: Joi.string().optional().allow(""),
  possui_logo: Joi.string().valid("SIM", "NÃO").optional().allow(""),

  chaves: Joi.array().items(chaveItem).optional(),
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
  plataforma: Joi.string().optional().allow(""),

  fw: Joi.string().max(30).optional().allow(""),
  sphs: Joi.string().max(30).optional().allow(""),
  firmware_version: Joi.string().max(30).optional().allow(""),

  versao_so: Joi.string().optional().allow(""),
  security_version: Joi.string().max(100).optional().allow(""),

  firmware: Joi.string().optional().allow(""),
  puk_crc: Joi.string().optional().allow(""),

  versao_bt: Joi.string().optional().allow(""),
  versao_wifi: Joi.string().optional().allow(""),

  versao_gprs: Joi.string().optional().allow(""),
  possui_logo: Joi.string().valid("SIM", "NÃO").optional().allow(""),

  chaves: Joi.array().items(chaveItem).optional(),
  qtd_chaves: Joi.number().integer().optional().allow(null),
  configurador: Joi.string().optional().allow(""),

  fonte: Joi.string().optional().allow(""),
  tipo_chaves: Joi.string().optional().allow(""),
  
  aplicacoes: Joi.array().items(aplicacaoItem).optional(),
});
