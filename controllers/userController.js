const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  User  = require('../models/userModel');

// Função assíncrona para criar usuário
async function criarUsuario(request, response) {
    try {
        const { nome, email, senha } = request.body;
        // Verifica se o email já está em uso
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ error: 'Email já está em uso' });
        }
        // Cria um novo usuário e hash a senha
        const hashedSenha = await bcrypt.hash(senha, 10);
        const newUser = new User({ nome, email, senha: hashedSenha }); // Salva o hash da senha
        await newUser.save();
        response.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Erro ao criar usuário' });
    }
}

// Função assíncrona para logar usuário
async function logarUsuario(request, response) {
    try {
        const { email, senha } = request.body;

        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }

        const passwordMatch = await bcrypt.compare(senha, user.senha); // Comparação de senhas hash
        if (!passwordMatch) {
            return response.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        response.json({ token });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Erro no servidor' });
    }
}

module.exports = { criarUsuario, logarUsuario };