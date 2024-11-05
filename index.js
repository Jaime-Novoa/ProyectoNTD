const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./src/models/user');
const Pago = require('./src/models/pago');
const authenticateToken = require('./middleware/auth');
const pagoRoutes = require('./routes/pagoRoutes');
const historialRoutes = require('./routes/historial');
const reciboRoutes = require('./routes/reciboRoutes');


const app = express();
app.use(express.json());

const JWT_SECRET = 'tu_clave_secreta_segura';

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/mi_base_de_datos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// 1. Endpoint para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { nombreCompleto, email, password } = req.body;

    if (!nombreCompleto || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const nuevoUsuario = new User({ nombreCompleto, email, passwordHash });
        await nuevoUsuario.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
});

// 2. Endpoint de inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Correo electrónico y contraseña son obligatorios.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
});

// 3. Endpoint de creación de pago
app.post('/pagos', authenticateToken, async (req, res) => {
    const { monto, concepto } = req.body;

    if (!monto || !concepto) {
        return res.status(400).json({ message: 'Monto y concepto son obligatorios.' });
    }

    const nuevoPago = new Pago({
        usuarioId: req.user.id, // Usa el ID del usuario autenticado
        monto,
        concepto,
        fechaPago: Date.now(),
        estado: 'PENDIENTE',
    });

    try {
        const pagoGuardado = await nuevoPago.save();
        res.status(201).json({ message: 'Pago creado exitosamente.', pago: pagoGuardado });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pago.' });
    }
});

//Endpoint para filtrar los pago
app.use('/api/historial', historialRoutes);//Ruta para historial de pagos
app.use('/api', pagoRoutes);//Ruta para pagos
app.use('/api/recibos', reciboRoutes);//Ruta para generar PDF

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});