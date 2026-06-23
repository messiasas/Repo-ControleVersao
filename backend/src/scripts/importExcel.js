import pkg from 'xlsx';
const { readFile, utils } = pkg;
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../config/database.js";
import VersionControl from "../models/VersionControl.js";

const COLUMN_MAP = {
  "Empresa":                  "empresa",
  "Equipamento":              "equipamento",
  "Modelo":                   "modelo",
  "Versão S.O.":              "versao_so",
  "BOOT / FIRMWARE VERSION":  "firmware",
  "PUK (CRC)":                "puk_crc",
  "Aplicação":                "aplicacao",  // ← corrigido (1 p)
  "Versão APP":               "versao_app",
  "Versão Módulo BT":         "versao_bt",
  "Versão Módulo WIFI":       "versao_wifi",
  "Versão Módulo GPRS":       "versao_gprs",
  "Possui logo":              "possui_logo",
  "Chaves":                   "chaves",
  "Quantidade de chaves":     "qtd_chaves",
  "Configurador":             "configurador",
  "Fonte":                    "fonte",
  "Tipo das chaves":          "tipo_chaves",
};

function normalizeLogoField(value) {
  const v = String(value ?? "").trim().toUpperCase();
  return (v === "SIM" || v === "1" || v === "TRUE" || v === "S") ? "SIM" : "NÃO";
}

async function run() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("\nUso: node src/scripts/importExcel.js <caminho>\n");
    process.exit(1);
  }

  const resolvedPath = path.resolve(filePath);
  console.log(`\nLendo arquivo: ${resolvedPath}`);

  let workbook;
  try {
    workbook = readFile(resolvedPath);  // ← usa resolvedPath, não filePath
  } catch (error) {
    console.error("Erro ao abrir o arquivo:", error);
    process.exit(1);
  }

  const sheetName = workbook.SheetNames[0];
  console.log(`Aba utilizada: "${sheetName}"`);

  const sheet = workbook.Sheets[sheetName];
  const rows = utils.sheet_to_json(sheet, { defval: null, range: 1 });
  console.log("Cabeçalhos:", Object.keys(rows[0]));

  if (rows.length === 0) {
    console.log("Nenhuma linha encontrada na planilha.");
    process.exit(0);
  }

  const headers = Object.keys(rows[0]);
  console.log(`\nColunas encontradas (${headers.length}):`);
  headers.forEach((h) => console.log(`  - "${h}"`));
  console.log("");

  await sequelize.authenticate();
  await sequelize.sync();

  let inserted = 0;
  let skipped = 0;

  for (const [i, row] of rows.entries()) {
    const record = {};

    for (const [excelCol, dbField] of Object.entries(COLUMN_MAP)) {
      const value = row[excelCol];
      if (value === null || value === undefined) continue;

      if (dbField === "possui_logo") {
        record[dbField] = normalizeLogoField(value);
      } else if (dbField === "qtd_chaves") {
        const n = Number(value);
        record[dbField] = isNaN(n) ? null : n;
      } else {
        record[dbField] = String(value).trim();
      }
    }

    if (!record.empresa && !record.equipamento && !record.modelo) {
      skipped++;
      continue;
    }

    try {
      await VersionControl.create(record);
      inserted++;
      if (inserted % 50 === 0) console.log(`  ${inserted} registros inseridos...`);
    } catch (err) {
      console.warn(`  Linha ${i + 2} ignorada: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\nImportação concluída!`);
  console.log(`  ✔ Inseridos: ${inserted}`);
  console.log(`  ✗ Ignorados: ${skipped}`);

  await sequelize.close();
}

run();