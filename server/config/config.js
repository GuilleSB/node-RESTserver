/**
 * PUERTO
 */
process.env.PORT = process.env.PORT || 3000;


/**
 * ENV
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/**
 * BD
 */
let urlDB;
//if (process.env.NODE_ENV === 'dev') {
//    urlDB = 'mongodb://localhost:27017/cafe';
//} else {
    urlDB = 'mongodb+srv://gu99soto:HJEh93VaTpbuRnLQ@cluster0-monml.mongodb.net/cafe'
//}

process.env.URLDB = urlDB;