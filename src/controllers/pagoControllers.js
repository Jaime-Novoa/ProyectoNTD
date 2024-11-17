const Pago = require('../models/pago');

// Función para mostrar pagos
exports.mostrarPagos = async (req, res) => {
    console.log('Entra a mostrar pagos');
    try {
        const pagos = await Pago.find();
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

    // Función para eliminar un pago
const eliminarPago = async (req, res) => {
    try {
        const { id } = req.params;
        const pago = await Pago.findByPk(id);

        if (!pago) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        await pago.destroy();
        res.status(200).json({ message: 'Pago eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el pago:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { eliminarPago };

const editarPago = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        // Opciones para devolver el documento actualizado
        const opciones = { new: true };

        // Buscar por ID y actualizar
        const pagoActualizado = await Pago.findByIdAndUpdate(id, datosActualizados, opciones);

        if (!pagoActualizado) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        res.status(200).json({ message: 'Pago actualizado con éxito', pago: pagoActualizado });
    } catch (error) {
        console.error('Error al actualizar el pago:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { editarPago };
};