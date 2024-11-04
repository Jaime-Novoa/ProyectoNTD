// models/User.js
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

// Método para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
    if (this.isModified('passwordHash')) {
        this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    }
    next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;