const { request, response } = require("express");
const Medico= require('../models/medico.model');

const getMedicos  = async (req=request, res=response)=>{

    const medicos = await Medico.find()
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img');
    res.json({
        ok:true,
        medicos
    });
}

const crearMedico  = async (req=request, res=response)=>{

    const uid= req.uid;
    const medico = new Medico({
        usuario:  uid,
        ...req.body
    });

    try {

        const medicoDB= await medico.save();

        res.json({
            ok:true,
            medico: medicoDB,
            msg:'mdico creado con éxito'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
            ok:false,
            msg:'Hable con el ADMIN'
        });
    }
  
}

const actualizarMedico  = async (req=request, res=response)=>{

    const MedicoId= req.params.id;
    const uid= req.uid;

    try {
        const MedicoDb= await Medico.findById(MedicoId);

        if(!MedicoDb){
            return res.status(404).json({
                ok:false,
                msg:'No existe el médico'
            });
        }

        const cambiosMedico={
            ...req.body,
            usuario: uid
        }

        const medicoUpdate= await Medico.findByIdAndUpdate(MedicoId,cambiosMedico,{new:true});

        res.json({
            ok:true,
            medico:medicoUpdate
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'hable con el admin'
        })
    }
   
}

const borrarMedico  = async (req=request, res=response)=>{

    const medicoId= req.params.id;

    try {
        const medicoDb= await Medico.findById(medicoId);

        if(!medicoDb){
            return res.status(404).json({
                ok:false,
                msg:'No existe medico liminr'
            });
        }

        await Medico.findByIdAndDelete(medicoId);

        res.json({
            ok:true,
            msg:"medico eliminado"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'hable con el admin'
        });
    }
}

const getMedico= async (req=request, res=response)=>{
    const medicoId= req.params.id;

    try {
        const medico= await Medico.findById(medicoId)
                        .populate('usuario','nombre img')
                        .populate('hospital','nombre img');

        res.json({
                  ok:true,
                  medico
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedico
}