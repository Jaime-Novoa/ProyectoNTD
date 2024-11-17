const mongoose = require('mongoose');

const apartamentoSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        unique: true,
    },
    propietario: {
        type: String,
        required: true,
    },
    numeroTelefono: {
        type: String,
        required: true,
    },
});

const Apartamento = mongoose.model('Apartamento', apartamentoSchema);

module.exports = Apartamento;
