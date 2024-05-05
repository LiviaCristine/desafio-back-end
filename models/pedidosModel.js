const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    numeroDoPedido: {
        type: String,
        required: true,
        index: true
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
    // referência ao usuário que fez o pedido
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
