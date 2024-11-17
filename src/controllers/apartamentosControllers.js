const Apartamento = require('../models/apartamentos');

exports.listarApartamentos = async (req, res) => {
    try {
        const apartamentos = await Apartamento.find();
        res.status(200).json(apartamentos);
    } catch (error) {
        console.error('Error al listar los apartamentos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.editarApartamento = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        // Opciones para devolver el documento actualizado
        const opciones = { new: true };

        // Buscar por ID y actualizar
        const apartamentoActualizado = await Apartamento.findByIdAndUpdate(id, datosActualizados, opciones);

        if (!apartamentoActualizado) {
            return res.status(404).json({ message: 'Apartamento no encontrado' });
        }

        res.status(200).json({ message: 'Apartamento actualizado con éxito', apartamento: apartamentoActualizado });
    } catch (error) {
        console.error('Error al actualizar el apartamento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.crearApartamento = async (req, res) => {
    const { numero, propietario, numeroTelefono } = req.body;

    if (!numero || !propietario || !numeroTelefono) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const nuevoApto = new Apartamento({
        numero,
        propietario,
        numeroTelefono,
    });

    try {
        const aptoGuardado = await nuevoApto.save();
        res.status(201).json({ message: 'Apto creado', Apartamento: aptoGuardado });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear apto.' });
    }
}