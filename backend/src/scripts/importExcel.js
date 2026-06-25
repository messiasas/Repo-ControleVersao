import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../config/database.js";
import { VersionControl, AplicacaoVersao } from "../models/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAMINHO_PLANILHA = path.join(__dirname, "../data/ENVIO PAG.xlsx");

const MAPA_VERSAO = {
  "Empresa":                "empresa",
  "Equipamento":            "equipamento",
  "Modelo":                 "modelo",
  "Versão S.O.":            "versao_so",
  "BOOT / FIRMWARE VERSION":"firmware",
  "PUK (CRC)":              "puk_crc",
  "Versão Módulo BT":       "versao_bt",
  "Versão Módulo WIFI":     "versao_wifi",
  "Versão Módulo GPRS":     "versao_gprs",
  "Possui logo":            "possui_logo",
  "Chaves":                 "chaves",
  "Quantidade de chaves":   "qtd_chaves",
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

  let importados = 0;

  for (const { linha, aplicacoes } of pacotes) {
    const dadosVersao = {};
    for (const [colExcel, campo] of Object.entries(MAPA_VERSAO)) {
      dadosVersao[campo] = normalizar(linha[colExcel], campo);
    }

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

    console.log(`  [${importados + 1}] ${dadosVersao.empresa} / ${dadosVersao.equipamento} — ${aplicacoes.length} aplicação(ões)`);
    importados++;
  }

  console.log(`\nConcluído: ${importados} pacote(s) importado(s).`);
  process.exit();
}

importar().catch((err) => {
  console.error("Erro na importação:", err);
  process.exit(1);
});
