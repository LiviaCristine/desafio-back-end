const mongoose = require('mongoose')
require('dotenv').config({ path: './config/.env' });
async function ConectaBancoDeDados() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Conexão com o banco de dados iniciou')

        await mongoose.connect(process.env.MONGO_URL)


        console.log('Conexão com o banco de dados foi feita com sucesso!')
       
    } catch(erro) {
        console.log(erro)
    }
}



module.exports = ConectaBancoDeDados
