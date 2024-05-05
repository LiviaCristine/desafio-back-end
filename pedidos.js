const express = require("express");
const app = express();
const pedidoRoutes = require('./routes/pedidoRoutes'); // Importa o roteador de pedidos
const userRoutes = require('./routes/userRoutes'); // Importa o roteador de usuários
const ConectaBancoDeDados = require('./bancodeDados');
const Pedido = require('./models/pedidosModel');
const { User } = require('./models/pedidosModel');


// Configuração do servidor para interpretar requisições no formato JSON
app.use(express.json());

// Conexão com o banco de dados MongoDB
ConectaBancoDeDados();

// Porta em que o servidor vai rodar
const porta = 3333;

// Função para mostrar a porta em que o servidor está rodando
function mostraPorta() {
    console.log("Servidor criado e rodando na porta", porta);
}

// Adiciona as rotas ao servidor
app.use('/pedidos', pedidoRoutes); // Roteador de pedidos no endpoint '/pedidos'
app.use('/users', userRoutes); // Roteador de pedidos no endpoint '/users'
app.use('/login', userRoutes);

// Inicia o servidor na porta especificada
app.listen(porta, mostraPorta);

module.exports = app;
