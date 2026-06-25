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
