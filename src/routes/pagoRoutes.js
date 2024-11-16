const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoControllers');
const authenticateToken = require('../middleware/auth');

// Ruta para listar pagos
router.get('/', authenticateToken, pagoController.mostrarPagos);

// Ruta para crear un nuevo pago
router.post('/', authenticateToken, pagoController.crearPago);

router.get('/listar', authenticateToken , pagoController.mostrarPagos);

module.exports = router;