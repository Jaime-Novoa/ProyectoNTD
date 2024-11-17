const express = require('express');
const router = express.Router();
const { eliminarUsuario } = require('../controllers/usuariosController');

// Ruta para eliminar un usuario
router.delete('/usuarios/:id', eliminarUsuario);

module.exports = router;