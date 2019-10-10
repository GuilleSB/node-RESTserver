require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 //Todo pasa por aca
// parse application/json
app.use(bodyParser.json());



app.get('/', function (req, res) {
  res.json('Hello World');
});

app.post('/usuario',function (req,res){
  let body = req.body; //Parametros post

  if(body.nombre === undefined){
    res.status(400).json({
      ok:false,
      msj: 'El nombre es necesario'
    });
  }else{
    res.json({
    body
  });
  }

  
});

app.put('/usuario/:id',function (req,res){

  let id = req.params.id; //Parametros por url

  res.json({
    id
  });

});
 
app.listen(process.env.PORT,()=>{
  console.log('Escuchando puerto: ',process.env.PORT);
});