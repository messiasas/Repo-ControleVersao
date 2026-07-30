import ExcelJS from "exceljs";

// Mesma ordem/nome de colunas usada na planilha de importação (src/data/ENVIO PAG.xlsx),
// para manter o layout horizontal familiar a quem já usa aquela planilha.
const COLUNAS = [
  { header: "Empresa",                 width: 20, campo: "empresa" },
  { header: "Equipamento",             width: 18, campo: "equipamento" },
  { header: "Plataforma",              width: 14, campo: "plataforma" },
  { header: "Modelo",                  width: 22, campo: "modelo" },
  { header: "FW",                      width: 10, campo: "fw" },
  { header: "SPHS",                    width: 12, campo: "sphs" },
  { header: "Firmware version",        width: 16, campo: "firmware_version" },
  { header: "Versão S.O.",             width: 45, campo: "versao_so" },
  { header: "Security Version(SV)",    width: 45, campo: "security_version" },
  { header: "BOOT",                    width: 12, campo: "firmware" },
  { header: "PUK (CRC)",               width: 16, campo: "puk_crc" },
  { header: "Applicação",              width: 115, campo: "_aplicacao_nome" },
  { header: "Versão APP",              width: 16, campo: "_aplicacao_versao" },
  { header: "Versão Módulo BT",        width: 18, campo: "versao_bt" },
  { header: "Versão Módulo WIFI",      width: 18, campo: "versao_wifi" },
  { header: "Versão Módulo GPRS",      width: 18, campo: "versao_gprs" },
  { header: "Possui logo",             width: 12, campo: "possui_logo" },
  { header: "Chaves",                  width: 30, campo: "_chaves" },
  { header: "Quantidade de chaves",    width: 14, campo: "qtd_chaves" },
  { header: "Configurador",            width: 16, campo: "configurador" },
  { header: "Fonte",                   width: 14, campo: "fonte" },
  { header: "Tipo das chaves",         width: 16, campo: "tipo_chaves" },
  { header: "Data Criação do pacote",  width: 20, campo: "createdAt" },
];

const THIN_BORDER = { style: "thin", color: { argb: "FFB0B7C3" } };
const CELL_BORDER = { top: THIN_BORDER, left: THIN_BORDER, bottom: THIN_BORDER, right: THIN_BORDER };

const INDICE_APLICACAO_NOME = COLUNAS.findIndex((col) => col.campo === "_aplicacao_nome");
const CHARS_POR_LINHA_APLICACAO = 110; // a coluna "Applicação" é larga o bastante p/ a maioria dos nomes caber numa linha só
const ALTURA_LINHA_BASE = 15;
const ALTURA_POR_LINHA_EXTRA = 13;

// A coluna "Applicação" é bem larga (ver COLUNAS acima) justamente para o
// nome do pacote caber numa única linha na maioria dos casos — isso permite
// manter a linha baixa (economizando espaço vertical). Só quando o nome
// excede essa largura a linha cresce para acomodar a quebra de texto.
function calcularAlturaLinha(nomeAplicacao) {
  const qtdLinhas = Math.max(1, Math.ceil(String(nomeAplicacao || "").length / CHARS_POR_LINHA_APLICACAO));
  return ALTURA_LINHA_BASE + (qtdLinhas - 1) * ALTURA_POR_LINHA_EXTRA;
}

function formatDataExportacao(data) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, "0");
  const min = String(data.getMinutes()).padStart(2, "0");
  const seg = String(data.getSeconds()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${hora}:${min}:${seg}`;
}

function formatDataCriacao(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "—" : formatDataExportacao(data);
}

function sanitizeSheetName(name) {
  return name.replace(/[[\]:*?/\\]/g, "").slice(0, 31) || "Pacote";
}

function valorCampo(version, campo, aplicacao) {
  switch (campo) {
    case "_aplicacao_nome":
      return aplicacao?.nome || "";
    case "_aplicacao_versao":
      return aplicacao?.versao || "";
    case "_chaves":
      return (version.chaves || []).map((c) => c.chave).filter(Boolean).join(", ");
    case "createdAt":
      return formatDataCriacao(version.createdAt);
    default:
      return version[campo] ?? "";
  }
}

function montarLinhas(version) {
  const aplicacoes = version.aplicacoes?.length > 0 ? version.aplicacoes : [null];

  // Primeira linha traz todos os dados do pacote; linhas extras (uma por
  // aplicação adicional) só preenchem Applicação/Versão APP — mesmo padrão
  // de agrupamento usado em ENVIO PAG.xlsx.
  return aplicacoes.map((aplicacao, index) => {
    if (index === 0) {
      return COLUNAS.map((col) => valorCampo(version, col.campo, aplicacao));
    }
    return COLUNAS.map((col) =>
      col.campo === "_aplicacao_nome" || col.campo === "_aplicacao_versao"
        ? valorCampo(version, col.campo, aplicacao)
        : ""
    );
  });
}

export async function buildVersionExcel(version) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Controle de Versão";
  workbook.created = new Date();

  const sheetName = sanitizeSheetName(`${version.empresa || "Pacote"} - ${version.equipamento || ""}`);
  const sheet = workbook.addWorksheet(sheetName, {
    // Congela as 2 primeiras colunas (Empresa/Equipamento) e as 3 primeiras
    // linhas (título, data de exportação e cabeçalho), para essas informações
    // continuarem visíveis mesmo rolando a planilha para os lados ou para baixo.
    views: [{ state: "frozen", xSplit: 2, ySplit: 3 }],
  });

  sheet.columns = COLUNAS.map((col) => ({ header: col.header, width: col.width }));

  const totalColunas = COLUNAS.length;

  const titleRow = sheet.insertRow(1, [`Ficha do pacote — ${version.empresa || "—"} / ${version.equipamento || "—"}`]);
  titleRow.getCell(1).font = { bold: true, size: 16, color: { argb: "FF1F2937" } };
  sheet.mergeCells(1, 1, 1, totalColunas);

  const exportRow = sheet.insertRow(2, [`Exportado em: ${formatDataExportacao(new Date())}`]);
  exportRow.getCell(1).font = { italic: true, size: 11, color: { argb: "FF6B7280" } };
  sheet.mergeCells(2, 1, 2, totalColunas);

  // O header original (linha 3, criado por sheet.columns) recebe o destaque visual.
  const headerRow = sheet.getRow(3);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF005C73" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = CELL_BORDER;
  });
  headerRow.height = 26;

  const linhas = montarLinhas(version);
  linhas.forEach((valores) => {
    const row = sheet.addRow(valores);
    row.height = calcularAlturaLinha(valores[INDICE_APLICACAO_NOME]);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = CELL_BORDER;
    });
  });

  // Colunas com um único valor por pacote (tudo, exceto Applicação/Versão APP)
  // ficam mescladas e centralizadas ao longo de todas as linhas de aplicação
  // — igual ao layout de ENVIO PAG.xlsx. Applicação/Versão APP continuam uma
  // linha por aplicação, já que variam registro a registro.
  const primeiraLinhaDados = 4;
  const ultimaLinhaDados = primeiraLinhaDados + linhas.length - 1;

  COLUNAS.forEach((col, idx) => {
    const numeroColuna = idx + 1;
    const isColunaApp = col.campo === "_aplicacao_nome" || col.campo === "_aplicacao_versao";

    if (isColunaApp) {
      linhas.forEach((_, i) => {
        const cell = sheet.getRow(primeiraLinhaDados + i).getCell(numeroColuna);
        cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
        if (i % 2 === 1) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F6F8" } };
        }
      });
      return;
    }

    if (linhas.length > 1) {
      sheet.mergeCells(primeiraLinhaDados, numeroColuna, ultimaLinhaDados, numeroColuna);
    }
    sheet.getRow(primeiraLinhaDados).getCell(numeroColuna).alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
  });

  // Somente leitura: bloqueia edição de células, formatação e estrutura da planilha.
  await sheet.protect(process.env.EXCEL_EXPORT_PASSWORD || "transire-readonly", {
    selectLockedCells: true,
    selectUnlockedCells: false,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
    insertColumns: false,
    insertRows: false,
    insertHyperlinks: false,
    deleteColumns: false,
    deleteRows: false,
    sort: false,
    autoFilter: false,
    pivotTables: false,
  });

  return workbook;
}
