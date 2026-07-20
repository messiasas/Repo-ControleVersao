import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import app from "../src/app.js";
import sequelize from "../src/config/database.js";
import User from "../src/models/User.js";

describe("POST /auth/login", () => {

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const hashedPassword = await bcrypt.hash("senha123", 10);
    await User.create({
      email: "teste@teste.com",
      password: hashedPassword,
      role: "admin",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("deve retornar 200 e um token JWT válido para credenciais corretas", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "teste@teste.com", password: "senha123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET); // decodifica o token usando o mesmo padrão do backend, se for invalido essa linha ja lanca um erro
    expect(decoded).toHaveProperty("id"); // confere se dentro do token existe o id do usuario
    expect(decoded).toHaveProperty("role", "admin"); // confere se dentro do token existe o role como "admin"
  });

});