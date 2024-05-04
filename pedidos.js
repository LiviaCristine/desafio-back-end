const express = require("express");
const app = express();
const router = express.Router();
const ConectaBancoDeDados = require('./bancodeDados');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Adicionando o pacote jsonwebtoken
const { User } = require('./pedidosModel');
const { Pedido } = require('./pedidosModel'); 





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

// Middleware de autenticação
function auth(request, response, next) {
    const token = request.header('Authorization');
  
    if (!token) {
      return response.status(401).json({ message: 'Token de autenticação não fornecido' });
    }
  
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
      request.user = decoded.user;
      next();
    } catch (error) {
      response.status(401).json({ message: 'Token de autenticação inválido' });
    }
}

// Função assíncrona para criar usuário
async function criarUsuario(request, response) {
    try {
        const { nome, email, senha } = request.body;
        // Verifique se o email já está em uso
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ error: 'Email já está em uso' });
        }
        // Crie um novo usuário e hash a senha
        const hashedSenha = await bcrypt.hash(senha, 10);
        const newUser = new User({ nome, email, senha: hashedSenha }); // Salve o hash da senha
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

// Função assíncrona para criar um novo pedido
async function criarPedidos(request, response) {
    try {
        // Cria um novo documento Pedido com base nos dados da requisição
        const novoPedido = new Pedido({
            numeroDoPedido: request.body.numeroDoPedido, 
            previsaoEntrega: request.body.previsaoEntrega,
            cliente: {
                nome: request.body.nome,
                documento: request.body.documento
            },
            enderecoEntrega: {
                rua: request.body.rua,
                numero: request.body.numero,
                bairro: request.body.bairro,
                cidade: request.body.cidade,
                estado: request.body.estado,
                cep: request.body.cep
            },
            itensPedido: [{
                descricao: request.body.descricao,
                preco: request.body.preco
            }],
            dataCriacao: new Date()
        });

        // Salva o novo pedido no banco de dados
        const pedidosCriado = await novoPedido.save();

        // Responde com o pedido criado e status HTTP 201 (Created)
        response.status(201).json(pedidosCriado);
    } catch (erro) {
        // Em caso de erro, loga o erro no console e responde com status HTTP 500 (Internal Server Error)
        console.log(erro);
        response.status(500).json({ erro: 'Erro ao criar o pedido' });
    }
};

// Função assíncrona para listar todos os pedidos inativos
async function listarPedidosInativos(request, response) {
    try {
        // Busca todos os pedidos marcados como inativos no banco de dados
        const pedidosInativos = await Pedido.find({ ativo: false });

        // Responde com os pedidos inativos encontrados
        response.json(pedidosInativos);
    } catch (erro) {
        // Em caso de erro, loga o erro no console e responde com status HTTP 500 (Internal Server Error)
        console.log(erro);
        response.status(500).json({ erro: 'Erro ao listar os pedidos inativos' });
    }
};

// Função assíncrona para listar todos os pedidos
async function listarPedidos(request, response) {
    try {
        // Busca todos os pedidos no banco de dados
        const pedidosVindosDoBancoDeDados = await Pedido.find();

        // Responde com os pedidos encontrados
        response.json(pedidosVindosDoBancoDeDados);
    } catch (erro) {
        // Em caso de erro, loga o erro no console e responde com status HTTP 500 (Internal Server Error)
        console.log(erro);
        response.status(500).json({ erro: 'Erro ao listar os pedidos' });
    }
};

// Função para filtrar pedidos
async function filtrarPedidos(request, response) {
    try {
        // Obtenha os parâmetros de consulta da requisição
        const { numero, dataInicial, dataFinal, status } = request.query;

        // Construa o objeto de filtro com base nos parâmetros de consulta
        const filtro = {};
        if (numero) filtro.numeroDoPedido = numero;
        if (dataInicial && dataFinal) filtro.previsaoEntrega = { $gte: dataInicial, $lte: dataFinal };
        if (status) filtro.ativo = status.toLowerCase() === 'ativo';

        // Execute a consulta no banco de dados com base no filtro
        const pedidosFiltrados = await Pedido.find(filtro);

        response.json(pedidosFiltrados);
    } catch (error) {
        console.error('Erro ao filtrar pedidos:', error);
        response.status(500).json({ error: 'Erro interno do servidor ao filtrar pedidos' });
    }
};

// Função assíncrona para atualizar um pedido existente
async function atualizarPedidos(request, response) {
    try {
        // Encontra e atualiza o pedido com base no _id fornecido na URL da requisição
        const pedidosAtualizado = await Pedido.findByIdAndUpdate(
            request.params.id, // _id do pedido a ser atualizado
            request.body, // Novos dados do pedido
            { new: true } // Retorna o documento atualizado
        );

        // Responde com o pedido atualizado
        response.json(pedidosAtualizado);
    } catch (erro) {
        // Em caso de erro, loga o erro no console e responde com status HTTP 500 (Internal Server Error)
        console.log(erro);
        response.status(500).json({ erro: 'Erro ao atualizar o pedido' });
    }
};

// Função assíncrona para deletar um pedido existente
async function deletarPedidos(request, response) {
    try {
        // Procura e atualiza o pedido com base no _id fornecido na URL da requisição
        const pedido = await Pedido.findByIdAndUpdate(
            request.params.id, // _id do pedido a ser atualizado
            { ativo: false }, // Define o campo "ativo" como false para marcar o pedido como excluído
            { new: true } // Retorna o documento atualizado
        );
        
        // Responde com uma mensagem indicando que o pedido foi excluído com sucesso
        response.json({ mensagem: 'Pedido excluído com sucesso' });
    } catch (erro) {
        // Em caso de erro, loga o erro no console e responde com status HTTP 500 (Internal Server Error)
        console.log(erro);
        response.status(500).json({ erro: 'Erro ao excluir pedido' });
    }
};

// Rotas da aplicação
// Rotas protegidas
router.post('/login',logarUsuario);// Rota para logar usuário
router.post('/users',criarUsuario) // Rota para criar um novo usuário
router.get('/pedidos', auth, listarPedidos);// Rota para listar todos os pedidos
router.get('/pedidos/inativos', auth, listarPedidosInativos);// Rota para listar todos os pedidos inativos (exclusão lógica)
router.get('/pedidos/filtrar', auth, filtrarPedidos);// Rota para filtrar pedidos
router.post('/pedidos', auth, criarPedidos);// Rota para criar um novo pedido
router.put('/pedidos/:id', auth, atualizarPedidos);// Rota para atualizar um pedido existente
router.delete('/pedidos/:id', auth, deletarPedidos);// Rota para deletar um pedido existente (exclusão lógica)

// Adiciona as rotas ao servidor
app.use(router);

// Inicia o servidor na porta especificada
app.listen(porta, mostraPorta);

module.exports = router;
