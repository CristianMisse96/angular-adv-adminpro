const mongoose = require('mongoose');

const dbConecction= async()=>{
    
    try{
        await mongoose.connect(process.env.DB_CNN);
        console.log('dbOnline');
    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de iniciar la DB por favor ver los logs');
    }
}

module.exports={
    dbConecction
}