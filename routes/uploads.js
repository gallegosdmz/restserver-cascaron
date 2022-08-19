const { Router } = require('express');
const { body, param } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const {validarCampos, validarArchivoSubir} = require('../middlewares');


const router = Router();

router.post('/', cargarArchivo);

router.put('/:coleccion/:id', [
    param('id', 'El id debe ser de mongo').isMongoId(),
    param('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    param('id', 'El id debe ser de mongo').isMongoId(),
    param('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

module.exports = router;