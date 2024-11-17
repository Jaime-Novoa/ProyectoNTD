const express = require('express');
const PDFDocument = require('pdfkit');
const Pago = require('../models/pago');
const router = express.Router();
const token = require('../middleware/auth')

router.post('/:pagoId', async (req, res) => {
    const { pagoId } = req.params;

    try {
        // Buscar el pago por ID
        const pago = await Pago.findById(pagoId).populate('apartamento');
        if (!pago) {
            return res.status(404).json({ message: 'Pago no encontrado.' });
        }

        // Obtener el nombre del propietario desde el apartamento
        const propietario = pago.apartamento.propietario;

        // Crear el documento PDF
        const doc = new PDFDocument();
        const reciboNombre = `recibo_${pagoId}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename=${reciboNombre}`);
        res.setHeader('Content-type', 'application/pdf');

        // Agregar contenido al PDF
        doc.fontSize(25).text('Recibo de Pago', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Propietario: ${propietario}`);
        doc.text(`Monto: $${pago.monto}`);
        doc.text(`Concepto: ${pago.concepto}`);
        doc.text(`Fecha de Pago: ${pago.fechaPago.toLocaleDateString()}`);
        doc.text(`Estado: ${pago.estado}`);
        
        doc.end();
        doc.pipe(res); // Envía el PDF como respuesta

    } catch (error) {
        console.error('Error al generar el recibo:', error);
        res.status(500).json({ message: 'Error al generar el recibo.' });
    }
    
    /*const { pagoId } = req.params;

    try {
        const pago = await Pago.findById(pagoId);
        if (!pago) {
            return res.status(404).json({ message: 'Pago no encontrado.' });
        }

        const doc = new PDFDocument();
        const reciboNombre = `recibo_${pagoId}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename=${reciboNombre}`);
        res.setHeader('Content-type', 'application/pdf');

        // Agregar contenido al PDF
        doc.fontSize(25).text('Recibo de Pago', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Usuario: ${pago.usuarioId.nombreCompleto}`);
        doc.text(`Monto: $${pago.monto}`);
        doc.text(`Concepto: ${pago.concepto}`);
        doc.text(`Fecha de Pago: ${pago.fechaPago.toLocaleDateString()}`);
        doc.text(`Estado: ${pago.estado}`);
        
        doc.end();
        doc.pipe(res); // Envía el PDF como respuesta

    } catch (error) {
        console.error('Error al generar el recibo:', error);
        res.status(500).json({ message: 'Error al generar el recibo.' });
    }*/
});

module.exports = router;
