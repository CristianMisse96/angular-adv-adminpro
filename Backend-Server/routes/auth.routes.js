/**
 * ruta: /api/login
 */

const {Router} =require('express');
const {login,googleSignIn, renewToken}= require('../controllers/auth.controller');
const {check}= require('express-validator');
const {validarCampos}= require('../middlewares/validar-campos');
const {validarJWT}= require('../middlewares/validar-jwt')

const router= Router();

router.post('/',
[
    check('email', 'el email es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatorio').not().isEmpty(),
    validarCampos
],
login
)


router.post('/google',
[
    check('token', 'el token de google es obligatorio').not().isEmpty(),
    validarCampos
],
googleSignIn
)

router.get('/renew',validarJWT,renewToken)

module.exports=router