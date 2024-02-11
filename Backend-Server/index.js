const express = require('express');
require('dotenv').config();
const {dbConecction}= require('./database/config');
const cors= require('cors');

//crear el servidor de express
const app= express();

//configurar cors
app.use(cors());
//carpetaa publica
app.use(express.static('public'));
//lectura y parse del body
app.use(express.json());
//Base de datos
dbConecction();
//rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/hospitales', require('./routes/hospitales.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/todo', require('./routes/busquedas.routes'));
app.use('/api/uploads', require('./routes/uploads.routes'));

app.listen(process.env.PORT ,()=> console.log('servidor corriendo en el puerto ' +3000) );