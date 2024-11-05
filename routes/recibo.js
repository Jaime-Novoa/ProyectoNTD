const express = require('express');
const PDFDocument = require('pdfkit');
const Pago = require('../src/models/pago');
const router = express.Router();

router.post('/:pagoId', async (req, res) => {
    const { pagoId } = req.params;

    try {
        const pago = await Pago.findById(pagoId).populate('usuarioId'); // Obtenemos el pago y el usuario asociado
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
    }
});

module.exports = router;
