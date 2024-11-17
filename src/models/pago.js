const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    monto: {
        type: Number,
        required: true,
    },
    concepto: {
        type: String,
        required: true,
    },
    apartamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartamento', // Hace referencia al modelo Apartamento
        required: true
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