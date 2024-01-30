var crypto = require("crypto");

function encriptarPassword(password){
    var salt=crypto.randomBytes(32).toString('hex');
    var hash=crypto.scryptSync(password, salt, 100000, 64, 'sha512').toString('hex');
    return {
        salt,
        hash
    }
}

function validarPassword(password, hash, salt){
    var hashEvaluar=crypto.scryptSync(password, salt, 100000, 64, 'sha512').toString('hex');
    return hashEvaluar === hash //== compara el string pero no el mismo tipo de dato
}

function autorizado(req, res, cb){
    if (req.session.cliente || req.session.admin){
        cb();
    }
    else {
        res.redirect("/");
    }
}

function admin(req, res, cb){
    if (req.session.admin){
        cb();
    }
    else {
        if(req.session.cliente){
            res.redirect("/mostrar")
        }
        else{
            res.redirect("/");
        }
    }
}

module.exports={
    encriptarPassword,
    validarPassword,
    autorizado,
    admin
}