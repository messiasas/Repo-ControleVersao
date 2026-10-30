// Ignora espaços, maiúsculas/minúsculas e acentos ao comparar nomes de chaves
export function normalizarNome(nome) {
  return (nome ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

export function findChaveConfig(chaveConfigs, nome) {
  const alvo = normalizarNome(nome);
  return chaveConfigs.find((cc) => normalizarNome(cc.nome) === alvo);
}
