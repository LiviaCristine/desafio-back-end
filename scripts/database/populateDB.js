const mongoose = require('mongoose');
const ConectaBancoDeDados = require('../../config/database/bancodeDados');
const  Pedidos  = require('../../models/pedidosModel');

// Função para conectar ao banco de dados
ConectaBancoDeDados();

// Array com os pedidos fictícios
const pedidosFicticios = [
    {
        numeroDoPedido: '1234',
        previsaoEntrega: new Date(),
        cliente: { nome: 'Jess', documento: '1234567890' },
        enderecoEntrega: {
        rua: 'Rua Azuza',
            numero: '123',
            bairro: 'Bairro Brasil',
            cidade: 'Mogi das Cruzes',
            estado: 'Belo Horizonte',
            cep: '12345-678'
        },
        itensPedido: [{ descricao: 'Item 1', preco: 10 }]
    },
    {
        numeroDoPedido: '1002',
        previsaoEntrega: new Date(),
        cliente: { nome: 'Lorelai Gilmore', documento: '0987654321' },
        enderecoEntrega: {
            rua: 'Star hollow',
            numero: '456',
            bairro: 'Minessota',
            cidade: 'America do Sul',
            estado: 'São Paulo',
            cep: '98765-432'
        },
        itensPedido: [{ descricao: 'Item 2', preco: 20 }]
    }
];

// Função para popular o banco de dados com os pedidos ficticios
async function populateDatabase() {
    try {
        // Insere os pedidos de exemplo no banco de dados
        const pedidosCriados = await Pedidos.create(pedidosFicticios);
        console.log("Pedidos criados com sucesso:", pedidosCriados);
    } catch (error) {
        console.error("Erro ao popular o banco de dados:", error);
    } finally {
        // Fecha a conexão com o banco de dados após a operação
        mongoose.connection.close();
    }
}

// Chama a função para popular o banco de dados
populateDatabase();
