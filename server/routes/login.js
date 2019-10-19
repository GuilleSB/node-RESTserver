const express = require('express');
const bcrypt = require('bcrypt'); //Encriptar contraseñas
const jwt = require('jsonwebtoken'); //Generar tokens de sesion

const { OAuth2Client } = require('google-auth-library'); //Libreria de google para autentificar
const client = new OAuth2Client(process.env.CLIENT_ID); 

const Usuario = require('../models/usuario'); // Importa esquema usuarios
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        /**
         * Devuelve un usuario donde el email del post y el de la bd hacen match
         */
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }


        if (!(bcrypt.compareSync(body.password, usuarioDB.password))) {
            /**
             * Compara las contraseñas encriptadas
             */
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({ //Genera el token con los datos que recibe como parametro
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });

});



/**
 * GOOGLE CONFIG
 */

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        /**
         * Devuelve el usuario de google en el formato 
         * personalizado de la aplicacion
         */
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    /**
     * Devuelve el usuario de google ya verificado!!
     * Si no da error
     */
    let googleUser = await verify(token)
        .catch(e => {
            if (e) {
                return res.status(403).json({
                    ok: false,
                    err: e
                });
            }
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            //Error del servidor
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            //Si el usuario ya existe


            if (usuarioDB.google === false) {
                //Verifica que el usuario sea de google, si no lo es, le indica al usuario que
                //debe autentificarse normalmente
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario debe iniciar sesion normalmente'
                    }
                });
            } else {
                //Si es un usuario de google, renueva el token para que pueda seguir logueado
                let token = jwt.sign({ //Genera el token con los datos que recibe como parametro
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }

        } else {
            //Si el usuario no existe en la base de datos lo crea y de una vez le genera un token

            let crearUsuario = new Usuario();
            crearUsuario.nombre = googleUser.nombre;
            crearUsuario.email = googleUser.email;
            crearUsuario.img = googleUser.img;
            crearUsuario.google = true;
            crearUsuario.password = process.env.passGoogle;

            crearUsuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({ //Genera el token con los datos que recibe como parametro
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });
        }
    });
});

module.exports = app;