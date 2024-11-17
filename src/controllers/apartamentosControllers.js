const Apartamento = require('../models/Apartamento');

const listarApartamentos = async (req, res) => {
    try {
        const apartamentos = await Apartamento.find();
        res.status(200).json(apartamentos);
    } catch (error) {
        console.error('Error al listar los apartamentos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { listarApartamentos };

const editarApartamento = async (req, res) => {
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

module.exports = { editarApartamento };