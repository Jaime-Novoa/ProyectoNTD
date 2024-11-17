const mongoose = require('mongoose');

const apartamentoSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        unique: true,
    },
    dueño: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    }
}, {
    timestamps: true, // Agrega campos de createdAt y updatedAt
});

const Apartamento = mongoose.model('Apartamento', apartamentoSchema);

module.exports = Apartamento;