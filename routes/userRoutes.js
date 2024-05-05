const express = require('express');
const { criarUsuario, logarUsuario } = require('../controllers/userController');
const router = express.Router();

router.post('/',logarUsuario);// Rota para logar usuário
router.post('/',criarUsuario) // Rota para criar um novo usuário

module.exports = router;