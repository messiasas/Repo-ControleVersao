import jwt from "jsonwebtoken";

// Por que o formato (req, res, next)?
// R: authMiddleware.js e validate.js exportam funções no formato que o Express espera: (req, res, next) => {...}.

export const authMiddleware = (req, res, next) => {
   // falta validação do formato (se vier um header maluco (ex: só "xyz" sem espaço), split(" ")[1] retorna undefined, cai no if (!token) e retorna 401 normalmente, então não quebra, mas não é uma validação explícita.)
    const token = req.headers.authorization?.split(" ")[1]; // separa o token e depois juntar tudo e gerar um token real (o token puro, sem a palavra "Bearer")

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // token valido? token alterado? token expirou?
        req.user = decoded; // injeta usuario na requisição, assim o user consegue fazer todo fluxo como criar, editar, excluir usando esse mesmo token

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