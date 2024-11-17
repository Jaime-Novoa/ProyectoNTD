const express = require('express');
const router = express.Router();
const aptoController = require('../controllers/apartamentosControllers');
const authenticateToken = require('../middleware/auth');

// Ruta para listar todos los apartamentos
router.get('/listar', authenticateToken, aptoController.listarApartamentos);

// Ruta para editar un apartamento
router.put('/editar/:id', authenticateToken, aptoController.editarApartamento);

// Ruta para cear un apartamento
router.post('/crear', aptoController.crearApartamento);

module.exports = router;
