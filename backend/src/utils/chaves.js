// Ignora espaços, maiúsculas/minúsculas e acentos ao comparar nomes de chaves
// (mesma regra do front em frontend/src/utils/chaves.js).
export function normalizarNome(nome) {
  return (nome ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}
