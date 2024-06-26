# Desafio de código Backend

#### Descrição

A construção deste backend consiste em um CRUD de pedidos, utilizando Node.js com o framework Express. Optei pelo Express devido à sua simplicidade, amplo ecossistema, flexibilidade, excelente performance, suporte para middleware e documentação abundante. As rotas são protegidas por JWT e as informações são fornecidas no formato Bearer nas requisições. O banco de dados utilizado para esta aplicação é o MongoDB, e o ODM para a conexão com o mesmo é o Mongoose. Além disso, o projeto inclui um script para a população do banco de dados, que pode ser executado através do comando no terminal node .\scripts\database\populateDB.js.

## Pré-requisitos
ANTES DE EXECUTAR O PROJETO É NECESSÁRIO 

1. Baixar o Node.JS

2. Baixar o npm(npm install)

3. Criar um cluster no MongoDB e ter a sua string de conexão do MongoDB

## Instalação

1. Clone o repositório
2. Instale as depêndencias
3. Execute o script "generateSecretKey.js" ele irá criar um .env e irá gerar um JWT_TOKEN

    No terminal,digite node .\scripts\generateSecretKey.js obs: só precisa executar o arquivo uma vez

5. Configure as variáveis de ambiente(use o arquivo .env_example para usar de base para a configuração)
6. Coloque o arquivo .env dentro da pasta config junto com o arquivo .env_example
8. Inicie o servidor(node ./pedidos.js)
   
## Dependências
* bcryptjs - Para criptografia de senhas(npm install bcryptjs).
* dotenv - Para carregar variáveis de ambiente de um arquivo .env(npm install dotenv).
* express - framework web para Node.js usado nesse projeto (npm install express).
* jsonwebtoken - Para geração e verificação de tokens JWT(npm install jsonwebtoken).
* mongodb - O driver oficial do MongoDB para Node.js(npm install mongodb).
* mongoose - Um ODM para MongoDB(npm install mongoose).
* cors - Pacote que permite consumir a api no front-end(npm install cors)

# Testando as rotas no insomnia ou no Postman: 

# Pré-requisitos
Certifique-se de ter o Insomnia ou o Postman instalado na sua máquina.

# Testando as Rotas
Abra o Insomnia ou o Postman e crie uma request collection
Clique na requisição que você deseja enviar para o seu servidor. 
Certifique-se de que as variáveis relevantes (por exemplo, URL, cabeçalho(header) para que você possa informar o token nas rotas privadas, corpo da solicitação) estejam configuradas corretamente.
Clique no botão "Send" para enviar a solicitação para o seu servidor.
O Insomnia exibirá a resposta do servidor, incluindo o código de status HTTP, o corpo da resposta e quaisquer cabeçalhos relevantes.

# Como fazer requisições nessa API
POST http://localhost:3333/users/criar: Esta requisição cria um usuário
{
    "nome": "Gisele",
    "email": "gisele@gmail.com",
    "senha": "12345"
}

POST http://localhost:3333/users/login: Esta requisição faz login do usuário e gera o token JWT para informar nas outras requisições que são privadas.
{
     "email": "gisele@gmail.com",
    "senha": "12345"
}

POST http://localhost:3333/pedidos: Esta requisição cria um pedido
{
    "numeroDoPedido": "345342",
    "previsaoEntrega": "2023-01-01",
    "cliente": {
        "nome": "Gisele",
        "documento": "12345678977"
    },
    "enderecoEntrega": {
        "rua": "Rua do Monte",
        "numero": "450",
        "bairro": "Lagoinha",
        "cidade": "Lago Azul",
        "estado": "MG",
        "cep": "08760-020"
    },
    "itensPedido": [
        {
            "descricao": "Um produto bom de se usar",
            "preco": 60.00
        }
    ]
}

POST http://localhost:3333/pedidos/filtrarpedidos: Esta requisição filtra os pedidos com base em parâmetros como número, período(data inicial e data final) e status,porém ela não está filtrando com base nos parâmetros passados na requisição 

GET http://localhost:3333/pedidos: Esta requisição lista todos os pedidos existentes no banco de dados

GET http://localhost:3333/pedidos/inativos): Esta requisição lista todos os pedidos inativos.

PUT http://localhost:3333/pedidos/:id: Esta requisição atualiza um pedido existente com o ID fornecido no parâmetro de rota.
{
    "numeroDoPedido": "345342",
    "previsaoEntrega": "2023-01-01",
    "cliente": {
        "nome": "Gisele",
        "documento": "12345678977"
    },
    "enderecoEntrega": {
        "rua": "Rua do Monte",
        "numero": "450",
        "bairro": "Lagoinha",
        "cidade": "Lago Azul",
        "estado": "MG",
        "cep": "08760-020"
    },
    "itensPedido": [
        {
            "descricao": "Um produto bom de se usar",
            "preco": 60.00
        }
    ]
}

DELETE http://localhost:3333/pedidos/:id: Esta requisição exclui um pedido existente com o ID fornecido no parâmetro de rota(exclusão lógica).



# Como usar o Token JWT
1. Após fazer login em um usuário, você receberá um token JWT.
2. Guarde esse token em um local seguro, pois é com ele que você irá acessar as rotas privadas(obs: Depois de 1hr o token expira e você terá que fazer a requisição de login novamente).
3. Ao fazer uma solicitação para uma rota protegida, inclua o token no cabeçalho(header) da solicitação da seguinte maneira: Authorization: Bearer seu_token

   #### Dúvidas sobre o código entre em contato pelo o linkedin: https://www.linkedin.com/in/livia-castro-73478319b/
 




