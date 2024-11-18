const express = require('express');
const router = express.Router();
const Pago = require('../models/pago');
const authenticateToken = require('../middleware/auth');

// Endpoint para listar los pagos con filtros avanzados
router.get('/listar', authenticateToken, async (req, res) => {
    try {
        const filtros = {};

        // Filtro por estado del pago (PENDIENTE, COMPLETADO, CANCELADO)
        if (req.query.estado) {
            filtros.estado = req.query.estado.toUpperCase(); // Debe estar en MAYÚSCULAS
        }

        // Filtro por rango de fechas
        if (req.query.fechaInicio && req.query.fechaFin) {
            filtros.fechaPago = {
                $gte: new Date(req.query.fechaInicio),
                $lte: new Date(req.query.fechaFin),
            };
        }

        // Filtro por concepto específico
        if (req.query.concepto) {
            filtros.concepto = new RegExp(req.query.concepto, 'i');
        }

        // Ejecución de la consulta con los filtros aplicados
        const pagos = await Pago.find(filtros);
        res.status(200).json(pagos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al listar el historial de pagos' });
    }
});

module.exports = router;