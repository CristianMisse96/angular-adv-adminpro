const { response, request } = require("express");
const Usuario = require('../models/usuario.model')
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt.helper");
const {googleVerify}= require('../helpers/google-verify.helper');
const {getMenuFrontend} = require('../helpers/menu-frontend-helper');

const login = async(req=request,res=response)=>{

    const {password,email} = req.body;
        
    try {
        const usuarioDb= await Usuario.findOne({email});
        if(!usuarioDb){
            return res.status(400)
                    .json({
                        ok:false,
                        msg:'email o contraseña invalidos'
                    });

        }
        //verificar contraseña
        const validPassword= bcrypt.compareSync(password, usuarioDb.password);

        if(!validPassword){
            return res.status(400)
                    .json({
                        ok:false,
                        msg:'email o contraseña invalidos'
                    });

        }

        //Generar el token
        const token = await generarJWT(usuarioDb.id);

        res.json({
            ok:true,
            token: token,
            menu: getMenuFrontend(usuarioDb.role),
        });

    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                ok:false,
                msg: 'hable con el administrador'
            })
    }
}


const googleSignIn = async(req=request,res=response)=>{

    try {
        const {email,name,picture}= await googleVerify(req.body.token); 
		
		

        const usuarioDb= await Usuario.findOne({email});

        let usuario;

        if(!usuarioDb){
            usuario = new Usuario({name,email,password:'@@@',picture,google:true});
        }else{
            usuario= usuarioDb;
			usuario.img=picture;
            usuario.google= true;
        }

        await usuario.save();

        //Generar el token
        const token = await generarJWT(usuario.id);

        res.json({
                ok:true,
                email,name,picture,
                token,
                menu: getMenuFrontend(usuario.role),
                msg: 'login googl correcto'
            });
    }catch (error) {
        console.log(error);
        res.status(400)
            .json({
                ok:false,
                msg: 'token de google no es correcto'
            })
    }
    
}

const renewToken = async(req=request,res=response)=>{

    const uid= req.uid;
    //generar token
    const token = await generarJWT(uid);
    const usuarioDb= await Usuario.findById(uid);
	
    res.json({
        ok:true,
        uid,
        usuario:usuarioDb,
        token,
        menu: getMenuFrontend(usuarioDb.role),
    })
}

module.exports={
    login,
    googleSignIn,
    renewToken
}