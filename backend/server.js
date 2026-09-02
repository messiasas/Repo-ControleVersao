import app from "./src/app.js"
import sequelize from "./src/config/database.js"

const PORT = 3000;

async function startServer(){
    try{
        await sequelize.authenticate();
        console.log("Conectado ao banco.");

        await sequelize.sync();

        app.listen(PORT, () => {                
            console.log(`Server rodando na port: ${PORT}`);
        });
    } catch (error) {
        console.error("Erro ao conectar no banco:", error);
    }
}

startServer();