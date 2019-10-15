const mongoose = require('mongoose');



/**
 * DEPRECATION WARNINGS FIXES
 */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
/**
 * DEPRECATION WARNINGS FIXES
 */




const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
/**
 * Crear modelos para acceder los esquemas
 * de la base de datos mongo
 * 
 */

let validarRole = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es valido'
}


let usuarioSchema = new Schema({
    nombre:{
        type:String,
        required: [true,'El nombre es necesario']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El correo es necesario']
    },
    password:{
        type:String,
        required:[true,'La contraseña es obligatoria']
    },
    img:{
        type:String,
        required: false
    },
    role:{
        type:String,
        enum: validarRole,
        default:'USER_ROLE'
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
       default:false
    }
});


usuarioSchema.methods.toJSON = function(){
    /**
     * Eliminar password del json para que no puedan ver el campo de la BD
     */
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} ya existe'});
/**
 * Muestra un mensaje de error mas amigable con el usuario...
 */


module.exports = mongoose.model('Usuario',usuarioSchema);
/**
 * Exportamos el modelo de esta forma...
 * mongoose.model('nombre que deseamos darle al schema', esquema que creamos);
 */
