const  Pedido  = require('../models/pedidosModel');

// Função assíncrona para criar pedidos
async function criarPedidos(request, response) {
    try {
        // Verifica se o usuário está autenticado
        const usuarioId = request.user ? request.user.id : null;

        // Verifica se todos os campos obrigatórios estão presentes na requisição
        const { numeroDoPedido, previsaoEntrega, cliente, enderecoEntrega, itensPedido } = request.body;

        if (!numeroDoPedido || !previsaoEntrega || !cliente || !enderecoEntrega || !itensPedido) {
            return response.status(400).json({ error: 'Os campos obrigatórios estão ausentes no corpo da solicitação' });
        }

        const { nome, documento } = cliente;
        const { rua, numero, bairro, cidade, estado, cep } = enderecoEntrega;

        // Cria um novo documento Pedido associado ao usuário
        const novoPedido = new Pedido({
            numeroDoPedido,
            previsaoEntrega,
            cliente: { nome, documento },
            enderecoEntrega: { rua, numero, bairro, cidade, estado, cep },
            itensPedido,
            usuario: usuarioId, // Associa o pedido ao usuário
            dataCriacao: new Date()
        });

        // Salva o novo pedido no banco de dados
        const pedidoCriado = await novoPedido.save();

        // Responde com o pedido criado e status HTTP 201 (Created)
        response.status(201).json(pedidoCriado);
    } catch (error) {
        // Em caso de erro, logar o erro no console e responder com status HTTP 500 (Internal Server Error)
        console.error(error);
        response.status(500).json({ error: 'Erro ao criar o pedido' });
    }
}

// Função assíncrona para listar todos os pedidos inativos
async function listarPedidosInativos(request,response) {
    try {
        // Busca todos os pedidos marcados como inativos(status:false) no banco de dados
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

// Função assíncrona para filtrarPedidos
async function filtrarPedidos(request, response){
    const { numero, dataInicial, dataFinal, status } = request.query;
    const filter = {};

    console.log('Filtros recebidos:', request.query); // Adicionando um log para os filtros recebidos na query

    if (numero) {
        filter.numeroDoPedido = numero;
    }

    if (dataInicial && dataFinal) {
        filter.previsaoEntrega = { $gte: new Date(dataInicial), $lte: new Date(dataFinal) };
    }

    if (status === 'ativo' || status === 'inativo') {
        filter.status = (status === 'ativo'); // Usando o campo status para filtrar
    }

    console.log('Filtro aplicado:', filter); // Adicionando um log para o filtro aplicado

    try {
        const pedidos = await Pedido.find(filter);

        console.log('Pedidos encontrados:', pedidos); // Adicionando um log para os pedidos encontrados

        response.json(pedidos);
    } catch (error) {
        response.status(500).json({ message: 'Erro ao buscar pedidos' });
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