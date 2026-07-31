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
  ["Pacote", "pacote"],
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
  garantirEspaco(doc, 26);
  doc.moveDown(0.4);
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COR_SECAO)
    .text(texto, MARGEM, doc.y);
  const y = doc.y + 2;
  doc
    .moveTo(MARGEM, y)
    .lineTo(MARGEM + larguraUtil(doc), y)
    .strokeColor(COR_LINHA)
    .lineWidth(1)
    .stroke();
  doc.y = y + 6;
}

const GRADE_GAP = 8;
const GRADE_PAD_X = 7;
const GRADE_PAD_Y = 5;
const GRADE_LABEL_VALOR_GAP = 2;

// Renderiza uma lista de pares {label, valor} em um grid de cartões,
// preenchendo a largura útil da página em `colunas` colunas por linha.
function grade(doc, pares, colunas) {
  if (!pares || pares.length === 0) {
    doc.font("Helvetica-Oblique").fontSize(9).fillColor(COR_MUTED).text("—", MARGEM);
    doc.moveDown(0.3);
    return;
  }

  const largura = larguraUtil(doc);
  const colWidth = (largura - GRADE_GAP * (colunas - 1)) / colunas;
  const innerWidth = colWidth - GRADE_PAD_X * 2;

  for (let i = 0; i < pares.length; i += colunas) {
    const linha = pares.slice(i, i + colunas);

    doc.font("Helvetica-Bold").fontSize(7.5);
    const alturaLabel = Math.max(
      ...linha.map((par) => doc.heightOfString(par.label.toUpperCase(), { width: innerWidth }))
    );

    doc.font("Helvetica").fontSize(9);
    const alturaValor = Math.max(
      ...linha.map((par) => doc.heightOfString(par.valor, { width: innerWidth }))
    );

    const alturaCelula = GRADE_PAD_Y * 2 + alturaLabel + GRADE_LABEL_VALOR_GAP + alturaValor;

    garantirEspaco(doc, alturaCelula + 6);
    const y = doc.y;

    linha.forEach((par, idx) => {
      const x = MARGEM + idx * (colWidth + GRADE_GAP);

      doc.rect(x, y, colWidth, alturaCelula).fillAndStroke("#f9fafb", COR_LINHA);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(COR_LABEL)
        .text(par.label.toUpperCase(), x + GRADE_PAD_X, y + GRADE_PAD_Y, { width: innerWidth });

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COR_VALOR)
        .text(par.valor, x + GRADE_PAD_X, y + GRADE_PAD_Y + alturaLabel + GRADE_LABEL_VALOR_GAP, {
          width: innerWidth,
        });
    });

    doc.y = y + alturaCelula + 6;
  }
}

function secaoCampos(doc, titulo, dados, campos, colunas = 3) {
  tituloSecao(doc, titulo);
  const pares = campos.map(([label, campo]) => {
    const bruto = dados[campo];
    return { label, valor: bruto != null && bruto !== "" ? String(bruto) : "—" };
  });
  grade(doc, pares, colunas);
}

function secaoLista(doc, titulo, pares, colunas = 2) {
  tituloSecao(doc, titulo);
  grade(doc, pares, colunas);
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
    .text(`Ficha do pacote — ${version.pacote || "—"} / ${version.equipamento || "—"}`, MARGEM, doc.y, {
      width: larguraUtil(doc),
    });

  doc
    .moveTo(MARGEM, doc.y + 6)
    .lineTo(MARGEM + larguraUtil(doc), doc.y + 6)
    .strokeColor(COR_SECAO)
    .lineWidth(2)
    .stroke();
  doc.moveDown(1);

  secaoCampos(doc, "Identificação", version, IDENTIFICACAO_FIELDS, 4);
  secaoCampos(doc, "Versões de software", version, VERSOES_FIELDS, 4);
  secaoCampos(doc, "Conectividade", version, CONECTIVIDADE_FIELDS, 3);
  secaoCampos(doc, "Segurança", version, SEGURANCA_FIELDS, 3);
  secaoCampos(doc, "Personalização", version, PERSONALIZACAO_FIELDS, 2);

  const aplicacoes = version.aplicacoes || [];
  secaoLista(
    doc,
    "Aplicações",
    aplicacoes.map((a) => ({ label: a.nome || "Aplicação", valor: a.versao || "—" })),
    3
  );

  const chaves = version.chaves || [];
  secaoLista(
    doc,
    "Chaves",
    chaves.map((c, i) => ({ label: `Chave ${i + 1}`, valor: c.chave || "—" })),
    2
  );

  doc.end();
  return resultado;
}
