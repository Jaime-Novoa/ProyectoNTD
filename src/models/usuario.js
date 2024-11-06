const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    nombreCompleto: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        enum: ['ADMIN', 'RESIDENTE'],
        default: 'RESIDENTE',
    },
    estado: {
        type: String,
        enum: ['ACTIVO', 'INACTIVO'],
        default: 'ACTIVO',
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
});

// Método para establecer la contraseña hasheada
userSchema.methods.setPassword = async function (password) {
    this.passwordHash = await bcrypt.hash(password, 10);
};

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('Usuario', userSchema);

module.exports = User;