import bcrypt from "bcryptjs";
import { User } from "../models/index.js";

export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });

    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "E-mail já cadastrado." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role: "admin" });

    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role", "createdAt"],
      order: [["email", "ASC"]],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists)
        return res.status(409).json({ message: "E-mail já cadastrado." });
      user.email = email;
    }

    if (password) {
      if (password.length < 6)
        return res.status(400).json({ message: "A senha deve ter ao menos 6 caracteres." });
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === Number(req.user.id))
      return res.status(400).json({ message: "Não é possível excluir o próprio usuário logado." });

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    await user.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
