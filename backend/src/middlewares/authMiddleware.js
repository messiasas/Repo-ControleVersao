import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
   // falta validação do formato
    const token = req.headers.authorization?.split(" ")[1]; // separa o token e depois juntar tudo e gerar um token real

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // token valido? token alterado? token expirou?
        req.user = decoded; // injeta usuario na requisição

        next(); // Libera o acesso para continuar o fluxo
    } catch {
        return res.status(401).json({ message: "Token inválido" }); 
    }
}

export const isAdmin = (req, res, next) => {
    
    if (req.user.role.toLowerCase() !== "admin"){
        return res.status(403).json({message: "Acesso negado"})
    }

    next();
}