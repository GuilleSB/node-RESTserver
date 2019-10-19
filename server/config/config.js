/**
 * PUERTO
 */
process.env.PORT = process.env.PORT || 3000;


/**
 * ENV
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



/**
 * CADUCIDAD DE LOS TOKEN
 * 60segundos
 * 60minutos
 * 24horas
 * 30dias
 */
process.env.CADUCIDAD_TOKEN = 1000 * 60 * 60 * 24;



/**
 * SEED del token
 * Variable de entorno con heroku
 */
process.env.SEED = process.env.SEED || "prueba-rest-api-desarrollo";



/**
 * BD
 */
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


/**
 * CLIENT_ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '207115188742-vck78jqhp5779h0ee7kaldt0v3i56mg5.apps.googleusercontent.com';




/**
 * Password google
 */
process.env.passGoogle = process.env.passGoogle || ':)';