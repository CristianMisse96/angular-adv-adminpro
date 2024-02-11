const {Router} =require('express');
const {check}= require('express-validator')
const {getMedicos,crearMedico,actualizarMedico,borrarMedico,getMedico} = require('../controllers/medicos.controller');
const { validarCampos}= require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router= Router();

router.get('/',validarJWT,getMedicos);

router.get('/:id',validarJWT,getMedico);

router.post('/',
    [
        validarJWT,
        check('nombre', 'el nombre del medico es necesario').notEmpty(),
        check('hospital', 'el Id del hospital deb ser válido').isMongoId(),
        validarCampos

    ]
    ,crearMedico
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'el nombre del medico es necesario').notEmpty(),
        check('hospital', 'el Id del hospital deb ser válido').isMongoId(),
        validarCampos
    ]
    ,actualizarMedico
);

router.delete('/:id',validarJWT, borrarMedico)

module.exports=router;