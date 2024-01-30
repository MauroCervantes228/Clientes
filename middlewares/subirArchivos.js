var multer=require("multer");
function subirArchivos(){
    var storage=multer.diskStorage({
        destination:'./web/images',
        filename: function(req, file, cb){
            var archivo=file.originalname;
            cb(null, archivo);
        }
    });
    var upload=multer({storage}).single('foto');
    return upload;
}
module.exports=subirArchivos;