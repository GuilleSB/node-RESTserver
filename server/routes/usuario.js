const express = require('express');
const bcrypt = require('bcrypt'); //Encriptar contraseñas
const _ = require('underscore'); // Funciones extra javascript - validar actualizaciones (PUT)
const Usuario = require('../models/usuario'); // Importa esquema usuarios
const app = express();

app.get('/usuario', function (req, res) {

  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  Usuario.find({estado:true}, 'nombre email role google')
    .skip(desde)
    .limit(limite)
    .exec((err, usuariosDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      /*Usuario.countDocuments({}, (err, cuantos) => { //Cantidad de registros en la base de datos que coinciden con los filtros
        res.json({
          ok: true,
          usuariosDB,
          cantidad:cuantos
        })
      });*/

      res.json({
        ok: true,
        usuariosDB,
        n_registros: usuariosDB.length
      })
    })

});

app.post('/usuario', function (req, res) {
  let body = req.body; //Parametros post

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10), //Encripta body.password y el hash lo hace 10 veces
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      usuarioDB
    });
  });

});

app.put('/usuario/:id', function (req, res) {

  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); // Solo los atributos del arreglo seran validos para actualizar

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });

});




app.delete('/usuario/:id', (req, res) => { // Delete no recibe parametros
  let id = req.params.id;

  let cambiarEstado = { //Indica lo que se desea cambiar 
    estado:false
  }

  Usuario.findByIdAndUpdate(id, cambiarEstado, {new:true} ,(err, usuarioBorrado) => {
    if (err || !usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: err || { message:'No existe el usuario'}
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado
    });
  });



  /* 
  ELIMINAR FISICAMENTE DE LA BASE DE DATOS (NO RECOMENDADO)
  Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
     if(err){
       res.status(400).json({
         ok:false,
         err
       })
     }
 
     if(!usuarioBorrado){
       res.status(400).json({
         ok:false,
         err: {
           message: 'Usuario no encontrado'
         }
       })
     }
 
     res.json({
       ok:true,
       usuarioBorrado
     })
   });*/
});

module.exports = app;