const { request, response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen-helper");
const path= require('path');
const fs= require('fs');

const fileUpload = (req=request,res=response)=>{

    const tipo= req.params.tipo;
    const id= req.params.id;

    const tiposPermitidos= ['hospitales','medicos','usuarios'];

    if(!tiposPermitidos.includes(tipo)){
        return res.status(400)
            .json({
                ok:false,
                msg:'no es un médico,usuario u hospital'
            });
    }
    //validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
                    .json({
                        ok:false,
                        msg: 'No hay ningun archivo.'
                    });
    }

    //manejar la imagen
    const file= req.files.imagen;
    const nombreCortado= file.name.split('.');
    const extensionArchivo= nombreCortado[nombreCortado.length-1];

    //validar extnsion
    const extensionsValidas= ['png','jpg','jpeg','gif'];
    if(!extensionsValidas.includes(extensionArchivo)){
        return res.status(400)
        .json({
            ok:false,
            msg:'no es una xtension permitida'
        });
    }

    const nombreArchivo= `${uuidv4()}.${extensionArchivo}`;

    //crear path guardar imagen
    const path= `./uploads/${tipo}/${nombreArchivo}`;

    file.mv(path, (err) =>{
        if (err){
          return res.status(500)
                    .json({
                        ok:false,
                        msg: 'error al movr la imagen'
                    });
        }

        res.json({
            ok:true,
            msg: 'Archivo subido',
            nombreArchivo
        })
      });

      //Actualizar base de datos
      actualizarImagen(tipo,id,nombreArchivo);
  
}

const cargarFoto= (req=request,res=response)=>{
    const {tipo, foto}= req.params;
    
    const pathImg= path.join(__dirname,`../uploads/${tipo}/${foto}`);
    
    //imagen por defecto
    try {
        if(fs.existsSync(pathImg)){
            res.sendFile(pathImg);
        }else{
            res.sendFile(path.join(__dirname,`../uploads/no-usuario.png`));
        }
    } catch (error) {
        
    }

    
}

module.exports={
    fileUpload,
    cargarFoto
}