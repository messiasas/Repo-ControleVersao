export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { stripUnknown: true }); // stripUnknown: true funciona como um filtro de segurança, verifica se os campos existem e rejeita os campos que não foram declarados

    if (error){
        return res.status(400).json({ message: error.message });
    }
    req.body = value;
    next();
}