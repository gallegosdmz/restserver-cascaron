const { Router } = require('express');
const { body, param } = require('express-validator');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoria, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

// Obtener todos los productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por id - publico
router.get('/:id', [
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crear producto - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('precio', 'El precio debe ser un número').isNumeric(),
    body('categoria', 'El id de la categoria no es valido').isMongoId(),
    body('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);

// Actualizar - privado - cualquiera con un token válido
router.put('/:id', [
    validarJWT,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeProductoPorId),
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], actualizarProducto);

// Borrar un producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;