const { request, response } = require("express");
const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');

const getTodo = async(req=request,res=response)=>{

    const busqueda= req.params.busqueda;
    const regex= new RegExp(busqueda,'i');

    const [usuarios,medicos,hospitales]= await Promise.all([
        Usuario.find({nombre:regex}),
        Medico.find({nombre:regex}),
        Hospital.find({nombre:regex})
    ]);
    
    res.json({
        ok:true,
        usuarios,
        medicos,
        hospitales
    })
}

const getDocumentosColeccion = async(req=request,res=response)=>{

    const tabla=req.params.tabla;
    const busqueda= req.params.busqueda;
    const regex= new RegExp(busqueda,'i');

    let data= [];

    switch (tabla) {
        case 'medicos':
            data= await Medico.find({nombre:regex});
        break;

        case 'hospitales':
            data= await Hospital.find({nombre:regex});
        break; 

        case 'usuarios':
            data= await Usuario.find({nombre:regex});
        break;

        default:
            return res.status(400)
                        .json({
                            ok: false,
                            msg: 'la tabla tiene que ser medicos/hospitales/usuarios'
                        });
        
      
    }

    res.json({
        ok:true,
        result: data
    });
}


module.exports={
    getTodo,
    getDocumentosColeccion
}