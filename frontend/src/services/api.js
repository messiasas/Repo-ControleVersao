const BASE_URL = "http://localhost:3000";

export const getVersions = async(search) => { // async para sicronizar/esperar respostas
    const query = search ?.trim() ? `?search=${encodeURIComponent(search)}` : "";

    console.log("URL:", `${BASE_URL}/versions${query}`);

    const response = await fetch(`${BASE_URL}/versions${query}`); // fetch é uma função JS que faz requisições http, isso é equivalente a GET /versions

    return response.json();
}