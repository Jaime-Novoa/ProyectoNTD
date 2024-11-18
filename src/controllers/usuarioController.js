const Usuario = require('../models/usuario');

exports.eliminarUsuario = async (req, res) => {
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

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json({ message: 'Usuarios listados exitosamente.', usuarios });
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).json({ message: 'Error al listar usuarios.' });
    }
};