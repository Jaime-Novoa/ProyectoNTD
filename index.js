const express = require('express');
const connectDB = require('./config/db'); // Asegúrate de importar la función de conexión
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./src/models/user');
const Pago = require('./src/models/pago');
const authenticateToken = require('./src/middleware/auth');
const pagoRoutes = require('./src/routes/pagoRoutes');
const historialRoutes = require('./src/routes/historialRoutes');
const reciboRoutes = require('./src/routes/reciboRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const JWT_SECRET = 'tu_clave_secreta_segura';

// Conexión a MongoDB usando la función de conexión
connectDB();

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

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
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

// Rutas para historial, pagos y recibos
app.use('/api/historial', historialRoutes); // Ruta para historial de pagos
app.use('/api/pagos', pagoRoutes); // Ruta para pagos
app.use('/api/recibos', reciboRoutes); // Ruta para generar PDF

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
