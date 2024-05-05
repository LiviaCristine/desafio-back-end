const jwt = require('jsonwebtoken');

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

module.exports = auth;