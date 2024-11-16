const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoControllers');
const authenticateToken = require('../middleware/auth');
const { eliminarPago } = require('../controllers/pagosController');

// Ruta para crear un nuevo pago
router.post('/', authenticateToken, pagoController.crearPago);

//Ruta para listar pagos
router.get('/listar', authenticateToken , pagoController.mostrarPagos);

module.exports = router;
const { eliminarPago } = require('../controllers/pagosController');

// Registrar la ruta DELETE /pagos/:id
router.delete('/pagos/:id', eliminarPago);

module.exports = router;