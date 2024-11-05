const Pago = require('../models/pago');

// Función para listar pagos
exports.listarPagos = async (req, res) => {
    try {
        const pagos = await Pago.find({ usuarioId: req.user.id });
        res.status(200).json(pagos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos.' });
    }
};

// Función para crear un nuevo pago
exports.crearPago = async (req, res) => {
    const { monto, concepto, estado } = req.body;

    if (!monto || !concepto || !estado) {
        return res.status(400).json({ message: 'Monto, concepto y estado son obligatorios.' });
    }
    if (estado != 'TARDE' && estado != 'COMPLETADO' && estado != 'INCOMPLETO'){
        return res.status(400).json({ message: 'Es estado solo puede ser: TARDE, COMPLETADO ó INCOMPLETO'})
    }
    

    const nuevoPago = new Pago({
        usuarioId: req.user.id,
        monto,
        concepto,
        estado,
    });

    try {
        const pagoGuardado = await nuevoPago.save();
        res.status(201).json({ message: 'Pago creado exitosamente.', pago: pagoGuardado });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pago.' });
    }
};