const mongoose = require('mongoose');

// Definição do modelo de usuário
const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

// Definição do modelo de pedido (anteriormente "pedidos")
const pedidoSchema = new mongoose.Schema({
    numeroDoPedido: {
        type: String,
        required: true,
        index: true // Adicionando índice ao campo numeroDoPedido
    },
    previsaoEntrega: {
        type: Date,
        required: true
    },
    cliente: {
        nome: {
            type: String,
            required: true
        },
        documento: {
            type: String,
            required: true
        }
    },
    enderecoEntrega: {
        rua: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            required: true
        },
        bairro: {
            type: String,
            required: true
        },
        cidade: {
            type: String,
            required: true
        },
        estado: {
            type: String,
            required: true
        },
        cep: {
            type: String,
            required: true
        }
    },
    itensPedido: [{
        descricao: {
            type: String,
            required: true
        },
        preco: {
            type: Number,
            required: true
        }
    }],
    dataCriacao: {
        type: Date,
        default: Date.now
    },
    ativo: {
        type: Boolean,
        default: true
    },
    // Adicionando referência ao usuário que fez o pedido
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Exportando os modelos de usuário e de pedido
module.exports = {
    User: mongoose.model('User', userSchema),
    Pedido: mongoose.model('Pedido', pedidoSchema) 
};
