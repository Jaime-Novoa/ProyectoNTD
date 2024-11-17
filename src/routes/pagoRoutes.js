const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoControllers');
const authenticateToken = require('../middleware/auth');
const { eliminarPago } = require('../controllers/pagosController');
const { editarPago } = require('../controllers/pagosController');


// Ruta para crear un nuevo pago
router.post('/crear', authenticateToken, pagoController.crearPago);

// Ruta para eliminar pagos
router.delete('/eliminar/:id', authenticateToken, pagoController.eliminarPago);

module.exports = router;