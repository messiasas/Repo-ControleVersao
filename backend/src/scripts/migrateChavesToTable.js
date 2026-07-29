import sequelize from "../config/database.js";

// Script único: copia os valores da antiga coluna VersionControls.chaves (varchar)
// para a nova tabela ChaveVersaos (1 pacote -> N chaves), antes que o
// sequelize.sync({ alter: true }) do server.js apague essa coluna.
// Rodar ANTES de reiniciar o backend com o novo código do modelo.

function splitChaves(valor) {
  if (typeof valor !== "string") return [];
  return valor.split(/[,;\n]/).map((v) => v.trim()).filter(Boolean);
}

async function migrar() {
  await sequelize.authenticate();

  const [colunas] = await sequelize.query("SHOW COLUMNS FROM VersionControls LIKE 'chaves'");
  if (colunas.length === 0) {
    console.log("Coluna 'chaves' não existe mais em VersionControls — nada para migrar (script já foi rodado ou o servidor já alterou a tabela).");
    process.exit(0);
  }

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS ChaveVersaos (
      id INT NOT NULL AUTO_INCREMENT,
      version_control_id INT NOT NULL,
      chave VARCHAR(255),
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      PRIMARY KEY (id)
    )
  `);

  const [rows] = await sequelize.query(
    "SELECT id, chaves FROM VersionControls WHERE chaves IS NOT NULL AND TRIM(chaves) <> ''"
  );

  console.log(`Encontrados ${rows.length} pacote(s) com chaves para migrar.`);

  let total = 0;
  for (const row of rows) {
    const chaves = splitChaves(row.chaves);
    for (const chave of chaves) {
      await sequelize.query(
        "INSERT INTO ChaveVersaos (version_control_id, chave, createdAt, updatedAt) VALUES (:vid, :chave, NOW(), NOW())",
        { replacements: { vid: row.id, chave } }
      );
      total++;
    }
  }

  console.log(`Migração concluída: ${total} chave(s) inserida(s) em ChaveVersaos.`);
  process.exit(0);
}

migrar().catch((err) => {
  console.error("Erro na migração:", err);
  process.exit(1);
});
