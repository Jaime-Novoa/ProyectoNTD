const Pago = require('../models/pago');
const Apartamento = require('../models/apartamentos');

// Función para crear un nuevo pago
exports.crearPago = async (req, res) => {

    const { monto, concepto, apartamento, estado } = req.body;

    if (!monto || !concepto || !estado || !apartamento) {
        return res.status(400).json({ message: 'Monto, concepto, estado y apartamento son obligatorios.' });
    }

    // Validar estado
    if (estado != 'TARDE' && estado != 'COMPLETADO' && estado != 'INCOMPLETO') {
        return res.status(400).json({ message: 'El estado solo puede ser: TARDE, COMPLETADO o INCOMPLETO' });
    }

    // Validar apartamento
    const apartamentosValidos = ['101', '102', '201', '202'];
    if (!apartamentosValidos.includes(apartamento)) {
        return res.status(400).json({ message: 'El número de apartamento debe ser: 101, 102, 201 o 202' });
    }

    try {
        // Buscar el apartamento por su número (esto podría ser un campo como 'numero')
        const apartamentoDoc = await Apartamento.findOne({ numero: apartamento });

        if (!apartamentoDoc) {
            return res.status(404).json({ message: 'Apartamento no encontrado.' });
        }

        // Crear el nuevo pago
        const nuevoPago = new Pago({
            monto,
            concepto,
            estado,
            apartamento: apartamentoDoc._id, // Asociar el ObjectId del apartamento
        });

        // Guardar el pago
        const pagoGuardado = await nuevoPago.save();
        res.status(201).json({ message: 'Pago creado exitosamente.', pago: pagoGuardado });
    } catch (error) {
        console.error('Error al crear el pago:', error);
        res.status(500).json({ message: 'Error al crear el pago.' });
    }    
};

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

// Función para editar un pago
exports.editarPago = async (req, res) => {
    const { id } = req.params; // ID del pago a editar
    const { monto, concepto, apartamento, estado } = req.body; // Datos a actualizar

    if (!monto || !concepto || !estado || !apartamento) {
        return res.status(400).json({ message: 'Monto, concepto, estado y apartamento son obligatorios.' });
    }

    try {
        // Buscar el apartamento por su número
        const apto = await Apartamento.findOne({ numero: apartamento });
        if (!apto) {
            return res.status(404).json({ message: 'Apartamento no encontrado.' });
        }

        // Actualizar el pago
        const pagoActualizado = await Pago.findByIdAndUpdate(
            id,
            { monto, concepto, apartamento: apto._id, estado },
            { new: true } // Retorna el documento actualizado
        );

        if (!pagoActualizado) {
            return res.status(404).json({ message: 'Pago no encontrado.' });
        }

        res.status(200).json({ message: 'Pago actualizado exitosamente.', pago: pagoActualizado });
    } catch (error) {
        console.error('Error al editar el pago:', error);
        res.status(500).json({ message: 'Error al editar el pago.' });
    }
};