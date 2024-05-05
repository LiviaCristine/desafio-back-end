const fs = require('fs');
const crypto = require('crypto');

// Verificar se o arquivo .env já existe
if (!fs.existsSync('.env')) {
    // Se o arquivo .env não existir, cria e adicione a chave secreta
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    fs.writeFileSync('.env', `JWT_SECRET=${jwtSecret}\n`);
    console.log('Chave secreta gerada e salva com sucesso!');
} else {
    // Se o arquivo .env já existir, adicione apenas a chave secreta
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    fs.appendFileSync('.env', `JWT_SECRET=${jwtSecret}\n`);
    console.log('Chave secreta adicionada com sucesso ao arquivo .env!');
}
