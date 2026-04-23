import jwt from "jsonwebtoken";  // Biblioteca responsavel por gerar tokens (autenticação)
import bcrypt from "bcryptjs";
import User from "../models/User.js"

export const login = async (email, password) => {
    const user = await User.findOne({ where:{email} });

    if (!user){
        throw new Error("Usuário não encontrado");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Senha inválida");
    }

    const token = jwt.sign(
        {id: user.id, role: user.role},
        
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

    return token;
}

