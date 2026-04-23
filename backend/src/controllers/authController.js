import * as authService from "../services/authService.js"

export const login = async (req, res) => {
    try {
        const {email, password} = req.body; // Separação por corpo: req.body.email e req.body.password

        const token = await authService.login(email, password);

        res.json({token});
        console.log("Login realizado!");
    } catch (err){
        res.status(401).json({message: err.message});
    }
};