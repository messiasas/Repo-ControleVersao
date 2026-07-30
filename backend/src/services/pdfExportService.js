import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.join(__dirname, "../assets/transire-logo.png");

const COR_TITULO = "#1f2937";
const COR_SECAO = "#005C73";
const COR_LABEL = "#4b5563";
const COR_VALOR = "#111827";
const COR_MUTED = "#6b7280";
const COR_LINHA = "#e5e7eb";

const MARGEM = 50;

const IDENTIFICACAO_FIELDS = [
  ["Empresa", "empresa"],
  ["Equipamento", "equipamento"],
  ["Modelo", "modelo"],
  ["Plataforma", "plataforma"],
  ["FW", "fw"],
  ["SPHS", "sphs"],
  ["Firmware version", "firmware_version"],
];

const VERSOES_FIELDS = [
  ["Versão SO", "versao_so"],
  ["Security Version(SV)", "security_version"],
  ["Firmware", "firmware"],
  ["Configurador", "configurador"],
];

const CONECTIVIDADE_FIELDS = [
  ["Versão BT", "versao_bt"],
  ["Wi-Fi", "versao_wifi"],
  ["GPRS", "versao_gprs"],
];

const SEGURANCA_FIELDS = [
  ["PUK/CRC", "puk_crc"],
  ["Tipo de chave", "tipo_chaves"],
  ["Qtd. chaves", "qtd_chaves"],
];

const PERSONALIZACAO_FIELDS = [
  ["Possui logo", "possui_logo"],
  ["Fonte", "fonte"],
];

function formatDataExportacao(data) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, "0");
  const min = String(data.getMinutes()).padStart(2, "0");
  const seg = String(data.getSeconds()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${hora}:${min}:${seg}`;
}

function larguraUtil(doc) {
  return doc.page.width - MARGEM * 2;
}

function garantirEspaco(doc, alturaNecessaria) {
  const limite = doc.page.height - doc.page.margins.bottom;
  if (doc.y + alturaNecessaria > limite) {
    doc.addPage();
  }
}

function tituloSecao(doc, texto) {
  garantirEspaco(doc, 30);
  doc.moveDown(0.6);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(COR_SECAO)
    .text(texto, MARGEM, doc.y);
  const y = doc.y + 2;
  doc
    .moveTo(MARGEM, y)
    .lineTo(MARGEM + larguraUtil(doc), y)
    .strokeColor(COR_LINHA)
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.5);
}

function linhaCampo(doc, label, valor) {
  garantirEspaco(doc, 18);
  const texto = valor != null && valor !== "" ? String(valor) : "—";

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(COR_LABEL)
    .text(`${label}:`, MARGEM, doc.y, { continued: true, width: larguraUtil(doc) });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COR_VALOR)
    .text(`  ${texto}`);

  doc.moveDown(0.2);
}

function linhaLista(doc, texto) {
  garantirEspaco(doc, 16);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COR_VALOR)
    .text(`•  ${texto}`, MARGEM + 10, doc.y, { width: larguraUtil(doc) - 10 });
  doc.moveDown(0.15);
}

function secaoCampos(doc, titulo, dados, campos) {
  tituloSecao(doc, titulo);
  for (const [label, campo] of campos) {
    linhaCampo(doc, label, dados[campo]);
  }
}

function secaoLista(doc, titulo, itens) {
  tituloSecao(doc, titulo);
  if (!itens || itens.length === 0) {
    doc.font("Helvetica-Oblique").fontSize(10).fillColor(COR_MUTED).text("—", MARGEM);
    doc.moveDown(0.2);
    return;
  }
  itens.forEach((item) => linhaLista(doc, item));
}

export async function buildVersionPdf(version) {
  const doc = new PDFDocument({ size: "A4", margin: MARGEM });
  const chunks = [];

  const resultado = new Promise((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  // Cabeçalho: logo Transire + data/hora da exportação
  try {
    doc.image(LOGO_PATH, MARGEM, MARGEM, { width: 130 });
  } catch {
    // segue sem logo caso o arquivo não esteja disponível no ambiente
  }

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(COR_MUTED)
    .text(`Exportado em: ${formatDataExportacao(new Date())}`, MARGEM, MARGEM + 6, {
      width: larguraUtil(doc),
      align: "right",
    });

  doc.y = MARGEM + 60;

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor(COR_TITULO)
    .text(`Ficha do pacote — ${version.empresa || "—"} / ${version.equipamento || "—"}`, MARGEM, doc.y, {
      width: larguraUtil(doc),
    });

  doc
    .moveTo(MARGEM, doc.y + 6)
    .lineTo(MARGEM + larguraUtil(doc), doc.y + 6)
    .strokeColor(COR_SECAO)
    .lineWidth(2)
    .stroke();
  doc.moveDown(1);

  secaoCampos(doc, "Identificação", version, IDENTIFICACAO_FIELDS);
  secaoCampos(doc, "Versões de software", version, VERSOES_FIELDS);
  secaoCampos(doc, "Conectividade", version, CONECTIVIDADE_FIELDS);
  secaoCampos(doc, "Segurança", version, SEGURANCA_FIELDS);
  secaoCampos(doc, "Personalização", version, PERSONALIZACAO_FIELDS);

  const aplicacoes = version.aplicacoes || [];
  secaoLista(
    doc,
    "Aplicações",
    aplicacoes.map((a) => `${a.nome || "—"} — ${a.versao || "—"}`)
  );

  const chaves = version.chaves || [];
  secaoLista(
    doc,
    "Chaves",
    chaves.map((c) => c.chave || "—")
  );

  doc.end();
  return resultado;
}
