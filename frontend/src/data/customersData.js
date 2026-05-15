import getnet from "../assets/customers/getnet_logo.png";
import mercadopago from "../assets/customers/mercadopago_logo.png";

import pagseguro from "../assets/customers/pagseguro_logo.jpg";
import pag1 from "../assets/customers/pagseguro_logo.jpg";
import pag2 from "../assets/customers/pagseguro_logo.jpg";
import pag3 from "../assets/customers/pagseguro_logo.jpg";

import safra from "../assets/customers/safra_logo.png";
import stone from "../assets/customers/stone_logo.png";

export const customersData = [
  {
    id: 1,
    nome: "getnet",
    terminais: 11,
    fabricantes: "PAX",
    status: "online",
    data_deploy: "10/01/2026",
    tecnologias: "ANDROID",
    imagem: getnet,
  },

  {
    id: 2,
    nome: "mercadopago",
    terminais: 5,
    fabricantes: "PAX, SUNMI",
    status: "offline",
    data_deploy: "07/08/2025",
    tecnologias: "PROLIN, ANDROID, MONITOR",
    imagem: mercadopago,
  },

  {
    id: 3,
    nome: "pagseguro",
    terminais: 20,
    fabricantes: "PAX, SUNMI",
    status: "updating",
    data_deploy: "26/04/2026",
    tecnologias: "ANDROID, MONITOR",
    imagem: pagseguro,
    
  },
    {
    id: 4,
    nome: "safra",
    terminais: 9,
    fabricantes: "PAX, SUNMI",
    status: "updating",
    data_deploy: "11/04/2025",
    tecnologias: "PROLIN, ANDROID, MONITOR",
    imagem: safra,
  },
    {
    id: 5,
    nome: "stone",
    terminais: 18,
    fabricantes: "PAX, SUNMI",
    status: "updating",
    data_deploy: "05/02/2026",
    tecnologias: "ANDROID",
    imagem: stone,
  },
];