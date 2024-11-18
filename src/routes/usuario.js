const express = require('express');
const router = express.Router();
const  controller  = require('../controllers/usuarioController');
const authenticateToken = require('../middleware/auth');

// Ruta para eliminar un usuario
router.delete('/eliminar/:id', authenticateToken, controller.eliminarUsuario);

// Ruta para listar usuarios
router.get('/listar',authenticateToken, controller.listarUsuarios);

module.exports = router;