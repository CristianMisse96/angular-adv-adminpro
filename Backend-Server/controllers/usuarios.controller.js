const Usuario= require('../models/usuario.model')
const {response, request}=require('express')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt.helper');

const getUsuarios=  async (req=request,res)=>{

    const desde= Number(req.query.desde) || 0;
     console.log(desde);
    const[usuarios,total]=await Promise.all([
        Usuario.find({}, 'nombre email role google img')
                     .skip(desde)
                     .limit(5),

        Usuario.countDocuments()
    ]);
    
    res.json({
        ok: true,
        usuarios,
        total
    })
}

const crearUsuarios= async (req,res= response)=>{

    const {email,password}= req.body;

    const existeEmail= await Usuario.findOne({email});

    if(existeEmail){
        return res.status(400)
                    .json({
                        ok: false,
                        msg: 'el correo ya está registrado'
                    })
    }


    try{
        const usuario= new Usuario(req.body);

        //encriptar contraseña
        const salt= bcrypt.genSaltSync();
        usuario.password= bcrypt.hashSync(password,salt);

        //guardar usuarios
        await usuario.save();
        //generar Token
        const token= await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario
        });
    }catch(error){
        console.log(error);
        res.status(500)
            .json({
                ok: false,
                msg: 'Error inesperado... revisar logs'
            })
    }

    
}

const actualizarUsuario= async (req,res= response)=>{
    //TODO: validar token y comprobar si es el usuario correcto

    try {

        const uid= req.params.id;

        const usuarioDb=await Usuario.findById(uid); 

        if(!usuarioDb){
            res.status(404)
                .json({
                    ok: false,
                    msg: 'el usuario no exite por ese id'
                });
        }

        //Actualizaciones
        const {password, google,email,...campos}= req.body;

        if(usuarioDb.email !== email){

            const existeEmail= await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400)
                            .json({
                                ok: false,
                                msg: 'ya existe un usuario con ese correo'
                            })
            }
        }
		if(!usuarioDb.google){
			campos.email = email;
		}else if(usuarioDb.email!==email){
			return res.status(400)
                            .json({
                                ok: false,
                                msg: 'Usuarios de google no pueden cambiar su correo'
                            })
		}
        
        const usuarioUpdate= await Usuario.findByIdAndUpdate(uid,campos,{new: true});

        res.json({
            ok: true,
            usuarioUpdate
        });
        
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                ok:false,
                msg:'Error inseperado'
            });
    }
}

const eliminarUsuario= async (req,res= response)=>{

    const uid= req.params.id;

    try {

        const usuarioDb=await Usuario.findById(uid); 

        if(!usuarioDb){
            res.status(404)
                .json({
                    ok: false,
                    msg: 'el usuario no exite por ese id'
                });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                ok:false,
                msg: 'Hable con el administrador'
            });
    }

}

module.exports={
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    eliminarUsuario
}