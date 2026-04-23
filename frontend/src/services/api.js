const BASE_URL = "http://localhost:3000";

export const getVersions = async() => { // async para sicronizar/esperar respostas
    const response = await fetch(`${BASE_URL}/versions`); // fetch é uma função JS que faz requisições http, isso é equivalente a GET /versions

    return response.json();
}