const { Router } = require('express');
const { body, param } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const {validarJWT, validarCampos, tieneRole, esAdminRole} = require('../middlewares');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categorias por id - publico
router.get('/:id', [
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);

module.exports = router;