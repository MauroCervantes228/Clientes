var admin=require("firebase-admin");
var keys=require("../Keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});
var micuenta=admin.firestore();
var conexionClientes=micuenta.collection("CRMnegocios");

module.exports={
    conexionClientes,
}