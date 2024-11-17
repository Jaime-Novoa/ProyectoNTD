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
    const { monto, concepto, apartamento, estado } = req.body;

    if (!monto || !concepto || !estado) {
        return res.status(400).json({ message: 'Monto, concepto y estado son obligatorios.' });
    }
    if (estado != 'TARDE' && estado != 'COMPLETADO' && estado != 'INCOMPLETO') {
        return res.status(400).json({ message: 'Es estado solo puede ser: TARDE, COMPLETADO ó INCOMPLETO' })
    }
    const apartamentosValidos = ['101', '102', '201', '202'];
    if (!apartamentosValidos.includes(apartamento)){
        return res.status(400).json({message: 'El número de apartamento debe ser: 101, 102, 201 ó 202'})
    }

    const nuevoPago = new Pago({
        monto,
        concepto,
        apartamento,
        estado,
    });

    try {
        const pagoGuardado = await nuevoPago.save();
        res.status(201).json({ message: 'Pago creado exitosamente.', pago: pagoGuardado });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pago.' });
    }
    
};

// Función para eliminar un pago
    /*const eliminarPago = async (req, res) => {
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
    };*/

// Función para eliminar un pago
exports.eliminarPago = async (req, res) => {
    const { id } = req.params; // ID del pago a eliminar

    try {
        const pagoEliminado = await Pago.findByIdAndDelete(id);
        if (!pagoEliminado) {
            return res.status(404).json({ message: 'Pago no encontrado.' });
        }

        res.status(200).json({ message: 'Pago eliminado exitosamente.', pago: pagoEliminado });
    } catch (error) {
        console.error('Error al eliminar el pago:', error);
        res.status(500).json({ message: 'Error al eliminar el pago.' });
    }
};
