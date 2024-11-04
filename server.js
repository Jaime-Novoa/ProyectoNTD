const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const app = express();
app.use(express.json());

// Configura tu conexión a MongoDB
const mongoURI = 'mongodb://localhost:27017/tu_base_de_datos'; // Cambia esto según tu configuración
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB', err));

const JWT_SECRET = 'your_secret_key'; // Usa una clave secreta segura en producción

// 1. Endpoint para registrar nuevos usuarios
app.post('/register', async (req, res) => {
    const { nombreCompleto, email, password, rol } = req.body;

    // Validar campos obligatorios
    if (!nombreCompleto || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Crear el nuevo usuario
    const newUser = new User({
        nombreCompleto,
        email,
        passwordHash: password, // Se encriptará en el hook pre-save
        rol,
    });

    try {
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente.', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
});

// 2. Endpoint de inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validar campos obligatorios
    if (!email || !password) {
        return res.status(400).json({ message: 'Correo electrónico y contraseña son obligatorios.' });
    }

    // Buscar el usuario por correo
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
    }

    // Verificar la contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user._id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});