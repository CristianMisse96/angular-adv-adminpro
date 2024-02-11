const { response, request } = require("express");
const  jwt  = require("jsonwebtoken");
const Usuario = require('../models/usuario.model');

const validarJWT= (req=request, res=response, next)=>{

    //leer token
    const token= req.header('x-token');

    if(!token){
       return res.status(401)
            .json({
                ok:false,
                msg: 'No existe token'
            })
    }

    //verificar token
    try {
        
        const {uid}= jwt.verify(token, process.env.JWT_SECRET);
        req.uid=uid;
        next();

    } catch (error) {
        res.status(401)
            .json({
                ok: false,
                msg:'token no valido'
            });
    }

}

const validarAdminRole = async (req=request, res=response, next)=>{
    
    const uid= req.uid;

    try {
        const usuarioDB= await Usuario.findById(uid);

        if(!usuarioDB){
            return  res.status(404)
                        .json({
                            ok: false,
                            msg:'usuario no existe'
                        });
        }

        if(usuarioDB.role !== 'ADMIN_ROLE'){
            return  res.status(403)
                        .json({
                            ok: false,
                            msg:'No tiene privilegios'
                        });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                ok: false,
                msg:'hable con el admin'
            });
    }
}

const validarAdminRoleMismoUsuario = async (req=request, res=response, next)=>{
    
    const uid= req.uid;
    const id= req.params.id;

    try {
        const usuarioDB= await Usuario.findById(uid);

        if(!usuarioDB){
            return  res.status(404)
                        .json({
                            ok: false,
                            msg:'usuario no existe'
                        });
        }

        if(usuarioDB.role === 'ADMIN_ROLE' || uid===id){
            next();
        }else{
            return  res.status(403)
                        .json({
                            ok: false,
                            msg:'No tiene privilegios'
                        });
        }

        
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                ok: false,
                msg:'hable con el admin'
            });
    }
}

module.exports={
    validarJWT,
    validarAdminRole,
    validarAdminRoleMismoUsuario
}