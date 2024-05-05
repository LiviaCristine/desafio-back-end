const express = require("express"); // aqui estou iniciando o express 
const pedidoRoutes = require('./routes/pedidoRoutes'); // Importa o roteador de pedidos
const userRoutes = require('./routes/userRoutes'); // Importa o roteador de usuários
const cors = require('cors'); // aqui estou trazendo o pacote cors que permite consumir essa api no fron-end

const ConectaBancoDeDados = require('./config/database/bancodeDados'); // aqui estou ligando ao arquivo banco de dados
ConectaBancoDeDados(); // estou chamando a função que conecta o banco de dados 


const app = express(); // aqui estou iniciando o app
app.use(express.json());
app.use(cors());

const porta = 3333; // aqui estou criando a porta que o servidor vai rodar

// Função para mostrar a porta em que o servidor está rodando
function mostraPorta() {
    console.log("Servidor criado e rodando na porta", porta);
}

// Adiciona as rotas ao servidor
app.use('/pedidos', pedidoRoutes); // Roteador de pedidos no endpoint '/pedidos'
app.use('/users', userRoutes); // Roteador de pedidos no endpoint '/users'

// Inicia o servidor na porta especificada
app.listen(porta, mostraPorta);

module.exports = app;
