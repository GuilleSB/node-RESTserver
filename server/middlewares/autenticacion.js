
const jwt = require('jsonwebtoken');

/**
 * Verificar tokens
 */

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.status(401).json({ // 401 retorna bad request
            ok: false,
            err: {
                message: 'Permisos insuficientes'
            }
        })
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}
