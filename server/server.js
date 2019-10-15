require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();





app.use(bodyParser.urlencoded({ extended: false }));
 //Todo pasa por aca
app.use(bodyParser.json());
app.use(require('./routes/usuario'));


/**CONEXION MONGOBD */
mongoose.connect(process.env.URLDB,(err,res)=>{
  if(err) throw err;
  console.log('Base de datos online en el puerto 27017');
});


/**PUERTO DE PAGINA WEB */
app.listen(process.env.PORT,()=>{
  console.log('Escuchando puerto: ',process.env.PORT);
});