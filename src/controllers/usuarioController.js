const Usuario = require('../models/usuario');

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar por ID y eliminar
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);

        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { eliminarUsuario };