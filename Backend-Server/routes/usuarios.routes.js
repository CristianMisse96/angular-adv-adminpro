/** Ruta: /api/usuarios */

const {Router} =require('express');
const {check}= require('express-validator')
const {getUsuarios,crearUsuarios, actualizarUsuario,eliminarUsuario} = require('../controllers/usuarios.controller');
const { validarCampos}= require('../middlewares/validar-campos');
const { validarJWT, validarAdminRole,validarAdminRoleMismoUsuario } = require('../middlewares/validar-jwt');
const router= Router();

router.get('/',validarJWT,getUsuarios);

router.post('/',
    [
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('password', 'la contraseña es obligatorio').not().isEmpty(),
        check('email', 'el email es obligatorio').isEmail(),
        validarCampos,
    ]
    ,crearUsuarios
);

router.put('/:id',
    [
        validarJWT,
        validarAdminRoleMismoUsuario,
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('role', 'el role es obligatorio').not().isEmpty(),
        validarCampos,
    ]
    ,actualizarUsuario
);

router.delete('/:id',[validarJWT,validarAdminRole], eliminarUsuario)

module.exports=router;