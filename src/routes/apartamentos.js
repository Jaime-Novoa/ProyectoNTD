const express = require('express');
const router = express.Router();
const { listarApartamentos } = require('../controllers/apartamentosController');
const { editarApartamento } = require('../controllers/apartamentosController');

// Ruta para listar todos los apartamentos
router.get('/apartamentos', listarApartamentos);

// Ruta para editar un apartamento
router.put('/apartamentos/:id', editarApartamento);

module.exports = router;
