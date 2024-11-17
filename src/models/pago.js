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
    apartamento: {
        type: String,
        reuired: true,
    },
    fechaPago: {
        type: Date,
        default: Date.now,
    },
    estado: {
        type: String,
        enum: ['TARDE', 'COMPLETADO', 'INCOMPLETO']
    },
});

const Pago = mongoose.model('Pago', pagoSchema);

module.exports = Pago;