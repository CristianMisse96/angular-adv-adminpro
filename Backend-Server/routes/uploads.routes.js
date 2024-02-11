/**ruta: api/todo */

const {Router} =require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload,cargarFoto} = require('../controllers/uploads.controller');
const expressFileUpload = require('express-fileupload');
const router= Router();

router.use(expressFileUpload());
router.put('/:tipo/:id',
    [
        validarJWT
    ],
    fileUpload
    
);

router.get('/:tipo/:foto',
    [
    
    ],
    cargarFoto
    
);

module.exports= router