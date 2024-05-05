const express = require('express');
const { 
    criarPedidos,
    listarPedidosInativos,
    listarPedidos,
    filtrarPedidos,
    atualizarPedidos,
    deletarPedidos
} = require('../controllers/pedidosController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router(); // aqui estou configurando a primeira parte da rota de pedidos

// Rotas da aplicação
// Rotas protegidas
router.get('/', auth, listarPedidos);// Rota para listar todos os pedidos
router.get('/inativos', auth, listarPedidosInativos);// Rota para listar todos os pedidos inativos (exclusão lógica)
router.get('/filtrar', auth, filtrarPedidos);// Rota para filtrar pedidos
router.post('/', auth, criarPedidos);// Rota para criar um novo pedido
router.put('/:id', auth, atualizarPedidos);// Rota para atualizar um pedido existente
router.delete('/:id', auth, deletarPedidos);// Rota para deletar um pedido existente (exclusão lógica)

module.exports = router;
