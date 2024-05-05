const { Pedido } = require('../models/pedidosModel');

async function criarPedidos(request, response) {
    try {
        // Verificar se todos os campos obrigatórios estão presentes na requisição
        const {
            numeroDoPedido,
            previsaoEntrega,
            cliente: { nome, documento },
            enderecoEntrega: { rua, numero, bairro, cidade, estado, cep },
            itensPedido
        } = request.body;

        // Verificar se o usuário está autenticado
        const usuarioId = request.user.id;
        if (!usuarioId) {
            return response.status(401).json({ error: 'Usuário não autenticado' });
        }

        // Criar um novo documento Pedido associado ao usuário
        const novoPedido = new Pedido({
            numeroDoPedido,
            previsaoEntrega,
            cliente: { nome, documento },
            enderecoEntrega: { rua, numero, bairro, cidade, estado, cep },
            itensPedido,
            usuario: usuarioId, // Associar o pedido ao usuário
            dataCriacao: new Date()
        });

        // Salvar o novo pedido no banco de dados
        const pedidoCriado = await novoPedido.save();

        // Responder com o pedido criado e status HTTP 201 (Created)
        response.status(201).json(pedidoCriado);
    } catch (error) {
        // Em caso de erro, logar o erro no console e responder com status HTTP 500 (Internal Server Error)
        console.error(error);
        response.status(500).json({ error: 'Erro ao criar o pedido' });
    }
}

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

async function filtrarPedidos(request, response) {
    try {
        // Obtenha os parâmetros de consulta da requisição
        const { numero, dataInicial, dataFinal, status } = request.query;

        // Construa o objeto de filtro com base nos parâmetros de consulta
        const filtro = {};
        if (numero) filtro.numeroDoPedido = numero;
        if (dataInicial && dataFinal) {
            filtro.previsaoEntrega = {
                $gte: new Date(dataInicial),
                $lte: new Date(dataFinal)
            };
        }
        if (status) filtro.status = status.toLowerCase();

        // Execute a consulta no banco de dados com base no filtro
        const pedidosFiltrados = await Pedido.find(filtro);

        // Formatar datas antes de enviar a resposta
        const pedidosFormatados = pedidosFiltrados.map(pedido => ({
            ...pedido._doc,
            previsaoEntrega: pedido.previsaoEntrega.toLocaleDateString() // Formatação da data
        }));

        response.json(pedidosFormatados);
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

module.exports = { 
    criarPedidos,
    listarPedidosInativos,
    listarPedidos,
    filtrarPedidos,
    atualizarPedidos,
    deletarPedidos
};