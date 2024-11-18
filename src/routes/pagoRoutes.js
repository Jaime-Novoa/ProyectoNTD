const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoControllers');
const authenticateToken = require('../middleware/auth');



// Ruta para crear un nuevo pago
router.post('/crear', authenticateToken, pagoController.crearPago);

// Ruta para eliminar pagos
router.delete('/eliminar/:id', authenticateToken, pagoController.eliminarPago);

//Ruta para editar pago
router.put('/editar/:id', authenticateToken, pagoController.editarPago);

module.exports = router;