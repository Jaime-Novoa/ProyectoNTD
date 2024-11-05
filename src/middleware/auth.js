// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tu_clave_secreta_segura';

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;