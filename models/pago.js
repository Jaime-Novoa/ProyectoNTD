// models/Pago.js
const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    monto: {
        type: Number,
        required: true,
    },
    concepto: {
        type: String,
        required: true,
    },
    fechaPago: {
        type: Date,
        default: Date.now,
    },
    estado: {
        type: String,
        enum: ['PENDIENTE', 'COMPLETADO', 'CANCELADO'],
        default: 'PENDIENTE',
    },
});

const Pago = mongoose.model('Pago', pagoSchema);

module.exports = Pago;