const express = require('express');
const router = express.Router();
const Pago = require('../models/Pago'); // Importa el modelo de Pago

// Endpoint para listar el historial de pagos con filtros avanzados
router.get('/historial', async (req, res) => {
    try {
        // Filtros para la consulta
        const filtros = {};

        // Filtro por ID de usuario (usuarioId)
        if (req.query.usuarioId) {
            filtros.usuarioId = req.query.usuarioId;
        }

        // Filtro por estado del pago (PENDIENTE, COMPLETADO, CANCELADO)
        if (req.query.estado) {
            filtros.estado = req.query.estado.toUpperCase(); // Asegura que esté en mayúsculas
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
            filtros.concepto = new RegExp(req.query.concepto, 'i'); // Búsqueda sin distinción de mayúsculas
        }

        // Ejecución de la consulta con los filtros aplicados
        const pagos = await Pago.find(filtros).populate('usuarioId', 'nombre'); // `populate` para incluir info del usuario si es necesario
        res.status(200).json(pagos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al listar el historial de pagos' });
    }
});

module.exports = router;