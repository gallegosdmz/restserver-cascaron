const { Router } = require('express');
const { body, param } = require('express-validator');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete} = require('../controllers/usuarios');


const {validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    param('id', 'No es un ID válido').isMongoId().bail(), //El .bail() NO ES NECESARIO
    param('id').custom(existeUsuarioPorId).bail(),
    body('rol').custom(esRoleValido).bail(),
    validarCampos
], usuariosPut);

router.post('/', [
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('password', 'El password debe de ser más de 6 letras').isLength({min: 6}),
    body('correo', 'El correo no es válido').isEmail(),
    body('correo').custom(emailExiste),
    body('rol').custom(esRoleValido),
    validarCampos
] , usuariosPost);

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports = router;