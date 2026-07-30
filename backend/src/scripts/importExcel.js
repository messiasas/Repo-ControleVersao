import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../config/database.js";
import { VersionControl, AplicacaoVersao, ChaveVersao, ChaveConfig } from "../models/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAMINHO_PLANILHA = path.join(__dirname, "../data/ENVIO PAG.xlsx");

// Mapeamento das colunas da planilha para os campos do VersionControl.
// "Quantidade de chaves" não entra aqui: seu valor é usado só para validar
// contra o total calculado a partir das chaves (ver calcularTotalChaves).
const MAPA_VERSAO = {
  "Empresa":                "empresa",
  "Equipamento":            "equipamento",
  "Plataforma":             "plataforma",
  "Modelo":                 "modelo",
  "FW":                     "fw",
  "SPHS":                   "sphs",
  "Firmware version":       "firmware_version",
  "Versão S.O.":            "versao_so",
  "Security Version(SV)":   "security_version",
  "BOOT":                   "firmware",
  "PUK (CRC)":              "puk_crc",
  "Versão Módulo BT":       "versao_bt",
  "Versão Módulo WIFI":     "versao_wifi",
  "Versão Módulo GPRS":     "versao_gprs",
  "Possui logo":            "possui_logo",
  "Configurador":           "configurador",
  "Fonte":                  "fonte",
  "Tipo das chaves":        "tipo_chaves",
};

function normalizar(valor, campo) {
  if (typeof valor === "string") {
    valor = valor.trim();
    if (valor === "") return null;
  }
  if (campo === "qtd_chaves") {
    const n = parseInt(valor, 10);
    return Number.isNaN(n) ? null : n;
  }
  return valor ?? null;
}

function extrairApp(linha) {
  const nome = typeof linha["Applicação"] === "string" ? linha["Applicação"].trim() : null;
  const versao = linha["Versão APP"] != null ? String(linha["Versão APP"]).trim() : null;
  if (!nome && !versao) return null;
  return { nome: nome || "", versao: versao || "" };
}

// A coluna "Chaves" pode trazer mais de uma chave separada por vírgula, ponto e vírgula ou quebra de linha.
function extrairChaves(linha) {
  const bruto = linha["Chaves"];
  if (typeof bruto !== "string") return [];
  return bruto.split(/[,;\n]/).map((v) => v.trim()).filter(Boolean);
}

function normalizarNomeChave(nome) {
  return nome.trim().toLowerCase();
}

function buildConfigMap(configs) {
  const map = new Map();
  for (const config of configs) {
    map.set(normalizarNomeChave(config.nome), config);
  }
  return map;
}

// Soma DUKPT + Master Key de cada chave do pacote (mesma regra usada no
// front ao calcular "Total de chaves"). Chaves sem configuração cadastrada
// contam 0 e são reportadas para o admin poder investigar.
function calcularTotalChaves(chaves, configMap) {
  const chavesSemConfig = [];
  const total = chaves.reduce((soma, nomeChave) => {
    const config = configMap.get(normalizarNomeChave(nomeChave));
    if (!config) {
      chavesSemConfig.push(nomeChave);
      return soma;
    }
    return soma + (Number(config.qtd_dukpt) || 0) + (Number(config.qtd_master_key) || 0);
  }, 0);
  return { total, chavesSemConfig };
}

// Agrupa linhas: uma linha com Equipamento/Modelo preenchido inicia um novo
// pacote; linhas seguintes com esses campos nulos são aplicações adicionais.
function agrupar(rows) {
  const pacotes = [];
  let atual = null;

  for (const linha of rows) {
    const novoRegistro = linha["Equipamento"] != null || linha["Modelo"] != null;

    if (novoRegistro) {
      if (atual) pacotes.push(atual);
      atual = { linha, aplicacoes: [] };
    }

    if (atual) {
      const app = extrairApp(linha);
      if (app) atual.aplicacoes.push(app);
    }
  }

  if (atual) pacotes.push(atual);
  return pacotes;
}

async function importar() {
  await sequelize.authenticate();
  await sequelize.sync();

  const wb = XLSX.readFile(CAMINHO_PLANILHA, { cellDates: true });
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: null });

  const pacotes = agrupar(rows);
  console.log(`Encontrados ${pacotes.length} pacotes na planilha.`);

  const configMap = buildConfigMap(await ChaveConfig.findAll());

  let importados = 0;
  const rejeitados = [];

  for (const { linha, aplicacoes } of pacotes) {
    const dadosVersao = {};
    for (const [colExcel, campo] of Object.entries(MAPA_VERSAO)) {
      dadosVersao[campo] = normalizar(linha[colExcel], campo);
    }

    const chaves = extrairChaves(linha);
    const qtdPlanilha = normalizar(linha["Quantidade de chaves"], "qtd_chaves");
    const { total: totalCalculado, chavesSemConfig } = calcularTotalChaves(chaves, configMap);

    if (qtdPlanilha != null && qtdPlanilha !== totalCalculado) {
      rejeitados.push({
        empresa: dadosVersao.empresa,
        equipamento: dadosVersao.equipamento,
        chaves,
        qtdPlanilha,
        totalCalculado,
        chavesSemConfig,
      });
      console.warn(
        `  [REJEITADO] ${dadosVersao.empresa} / ${dadosVersao.equipamento} — planilha diz ${qtdPlanilha} chave(s), ` +
        `mas o cálculo a partir de "${chaves.join(", ")}" deu ${totalCalculado}` +
        (chavesSemConfig.length > 0 ? ` (sem configuração cadastrada: ${chavesSemConfig.join(", ")})` : "")
      );
      continue;
    }

    dadosVersao.qtd_chaves = totalCalculado;

    const record = await VersionControl.create(dadosVersao);

    // Define createdAt manualmente se a planilha tiver data
    const dataCriacao = linha["Data Criação do pacote"];
    if (dataCriacao) {
      const data = dataCriacao instanceof Date ? dataCriacao : new Date(dataCriacao);
      if (!isNaN(data.getTime())) {
        await sequelize.query(
          "UPDATE VersionControls SET createdAt = ?, updatedAt = ? WHERE id = ?",
          { replacements: [data, data, record.id] }
        );
      }
    }

    if (aplicacoes.length > 0) {
      await AplicacaoVersao.bulkCreate(
        aplicacoes.map((a) => ({ version_control_id: record.id, nome: a.nome, versao: a.versao }))
      );
    }

    if (chaves.length > 0) {
      await ChaveVersao.bulkCreate(
        chaves.map((chave) => ({ version_control_id: record.id, chave }))
      );
    }

    console.log(`  [${importados + 1}] ${dadosVersao.empresa} / ${dadosVersao.equipamento} — ${aplicacoes.length} aplicação(ões), ${chaves.length} chave(s)`);
    importados++;
  }

  console.log(`\nConcluído: ${importados} pacote(s) importado(s).`);
  if (rejeitados.length > 0) {
    console.log(`${rejeitados.length} pacote(s) rejeitado(s) por divergência na quantidade de chaves:`);
    for (const r of rejeitados) {
      console.log(`  - ${r.empresa} / ${r.equipamento}: planilha=${r.qtdPlanilha}, calculado=${r.totalCalculado}, chaves=[${r.chaves.join(", ")}]`);
    }
  }

  process.exit();
}

importar().catch((err) => {
  console.error("Erro na importação:", err);
  process.exit(1);
});
