const express = require('express');
const { criarUsuario, logarUsuario } = require('../controllers/userController');
const router = express.Router(); // aqui estou configurando a primeira parte da rota de usuários

router.post('/login',logarUsuario);// Rota para logar usuário
router.post('/criar',criarUsuario) // Rota para criar um novo usuário

module.exports = router;