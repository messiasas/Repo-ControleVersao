import sequelize from "../config/database.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
//import "dotenv/config";


await sequelize.sync();

const userExist = await User.findOne({where: {email: "admin@gmail.com"}});

if (!userExist){
    await User.create({
        email: "admin@gmail.com",
        password: await bcrypt.hash("123456",10),
        role: "admin",
    });
    console.log("Admin criado!");
}else{
    console.log("Admin já existente.");
}

process.exit(); // Uma vez que voce faz uma tarefa no database, a tarefa fica aberta. Por isso devemos encerrar usando process.exit()