const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos', error);
        process.exit(1); // Termina el proceso si la conexión falla
    }
};

module.exports = connectDB;
