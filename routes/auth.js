const { Router } = require('express');
const { body} = require('express-validator');

const { login, googleSignIn, renovarToken } = require('../controllers/auth');

const {validarCampos, validarJWT} = require('../middlewares');


const router = Router();

router.post('/login',[
    body('correo', 'El correo es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], login);

router.post('/google',[
    body('id_token', 'El id_token es obligatorio').notEmpty(),
    validarCampos
], googleSignIn);

router.get('/', validarJWT, renovarToken);

module.exports = router;