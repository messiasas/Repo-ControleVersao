import getnet from "../assets/customers/getnet_logo.png";
import mercadopago from "../assets/customers/mercadopago_logo.png";

import pagseguro from "../assets/customers/pagseguro_logo.jpg";
import safra from "../assets/customers/safra_logo.png";
import stone from "../assets/customers/stone_logo.png";

export const customersData = [
  {
    id: 1,
    nome: "getnet",
    terminais: 11,
    status: "online",
    imagem: getnet,
  },

  {
    id: 2,
    nome: "mercadopago",
    terminais: 5,
    status: "offline",
    imagem: mercadopago,
  },

  {
    id: 3,
    nome: "pagseguro",
    terminais: 20,
    status: "updating",
    imagem: pagseguro,
  },
    {
    id: 4,
    nome: "safra",
    terminais: 9,
    status: "updating",
    imagem: safra,
  },
    {
    id: 5,
    nome: "stone",
    terminais: 18,
    status: "updating",
    imagem: stone,
  },
];