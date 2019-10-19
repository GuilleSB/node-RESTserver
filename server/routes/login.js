const express = require('express');
const bcrypt = require('bcrypt'); //Encriptar contraseñas
const jwt = require('jsonwebtoken'); //Generar tokens de sesion
const Usuario = require('../models/usuario'); // Importa esquema usuarios
const app = express();


app.post('/login',(req,res)=>{
    
    let body = req.body;

    Usuario.findOne({email: body.email},(err,usuarioDB)=>{
        /**
         * Devuelve un usuario donde el email del post y el de la bd hacen match
         */
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }


        if(!(bcrypt.compareSync(body.password,usuarioDB.password))){
            /**
             * Compara las contraseñas encriptadas
             */
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({ //Genera el token con los datos que recibe como parametro
            usuario:usuarioDB
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        });
    });

});


module.exports = app;