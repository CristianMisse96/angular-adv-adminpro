const { request, response } = require("express");
const Hospital = require('../models/hospital.model');
const { populate } = require("dotenv");


const getHospitales  =  async(req=request, res=response)=>{

    const hospitales = await Hospital.find()
                                .populate('usuario','nombre img');

    res.json({
        ok:true,
        hospitales
    });
}

const crearHospital  = async (req=request, res=response)=>{
    
    const uid= req.uid;
    const hospital= new Hospital({
        usuario: uid,
        ...req.body
    });
    

    try {
         const hospitalPersist= await hospital.save();
        
        res.json({
            ok:true,
            hospital: hospitalPersist,
            msg:'crearHospital'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                ok: false,
                msg: 'Hable con el ADMIN'
            });
    }
   
}

const actualizarHospital  = async(req=request, res=response)=>{

    const hospitalId= req.params.id;
    const uid= req.uid;

    try {
        const hospitalDb= await Hospital.findById(hospitalId);

        if(!hospitalDb){
            return res.status(404).json({
                ok:false,
                msg:'No existe l hospital'
            });
        }

        const cambiosHospital={
            ...req.body,
            usuario: uid
        }

        const hospitalUpdate= await Hospital.findByIdAndUpdate(hospitalId,cambiosHospital,{new:true});

        res.json({
            ok:true,
            hospital:hospitalUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'hable con el admin'
        });
    }
    
    /*res.json({
        ok:true,
        msg:'actualizarHospital'
    });*/
}

const borrarHospital  = async(req=request, res=response)=>{

    const hospitalId= req.params.id;

    try {
        const hospitalDb= await Hospital.findById(hospitalId);

        if(!hospitalDb){
            return res.status(404).json({
                ok:false,
                msg:'No existe l hospital'
            });
        }

        await Hospital.findByIdAndDelete(hospitalId);

        res.json({
            ok:true,
            msg:"Hospital eliminado"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'hable con el admin'
        });
    }
}


module.exports={
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}