var conexion=require("./conexion").conexionClientes;
var {encriptarPassword}=require("../middlewares/funcionesPassword");
var Cliente=require("../modelos/Cliente");
const bcrypt = require('bcrypt');

async function compararPassword(contraseñaIngresada, contraseñaAlmacenada) {
    try {
        return await bcrypt.compare(contraseñaIngresada, contraseñaAlmacenada);
    } catch (error) {
        console.log("Error al comparar contraseñas: " + error);
        return false;
    }
}

async function verificarCredenciales(cliente, password) {
    try {
        const querySnapshot = await conexion.where("cliente", "==", cliente).get();
        if (querySnapshot.empty) {
            return null;
        }
        const clienteEncontrado = querySnapshot.docs[0].data();

        if (clienteEncontrado.password !== undefined && clienteEncontrado.salt !== undefined) {
            const contraseñaValida = compararPassword(password, clienteEncontrado.password, clienteEncontrado.salt);

            if (contraseñaValida) {
                return clienteEncontrado;
            } else {
                return null;
            }
        } else {
            return null; 
        }
    } catch (error) {
        console.log("Error al verificar las credenciales: " + error);
        return null;
    }
}


async function mostrarClientes(){
    var clients=[];
    try {
        var clientes=await conexion.get();
        clientes.forEach(cliente =>{
            var client=new Cliente(cliente.id, cliente.data());
            if (client.bandera==0){
                clients.push(client.obtenerDatos);
        }
    })
    }
    catch(err){
        console.log("Error al recuperar clientes de la BD" + err);
    }
    return clients;
}

async function buscarPorID(id){
    var client;
    try{
        var cliente=await conexion.doc(id).get();
        var clienteObjeto=new Cliente(cliente.id, cliente.data());
        if (clienteObjeto.bandera==0){
            client=clienteObjeto.obtenerDatos;
        }
    }
    catch(err){
        console.log("Error al recuperar al cliente"+err);
    }
    return client;
}

async function nuevoCliente(datos){
    var {hash, salt}=encriptarPassword(datos.password);
    datos.password=hash;
    datos.salt=salt;
    datos.admin=false;
    var client=new Cliente(null,datos);
    var error=1;
    if (client.bandera==0){
        try{
            await conexion.doc().set(client.obtenerDatos);
            console.log("Cliente insertado a la BD");
            error=0;
        }
        catch(err){
            console.log("Error al capturar el nuevo cliente"+err);
        }   
    }
    return error;
}

async function modificarCliente(datos){
    //console.log(datos.foto);
    //console.log(datos.fotoVieja);
    //console.log(datos.password);
    //console.log(datos.passwordViejo);
    var error=1;
    var respuestaBuscar=await buscarPorID(datos.id);
    if (respuestaBuscar!=undefined) {
        if (datos.password=""){
            datos.password=datos.passwordViejo;
            datos.salt=datos.saltViejo;
        }
        else {
            var {salt, hash}=encriptarPassword(datos.password);
            datos.password=hash;
            datos.salt=salt;
        }
        var client=new Cliente(datos.id,datos);
        if (client.bandera==0){
            try{
                await conexion.doc(client.id).set(client.obtenerDatos);
                console.log("Registro actualizado");
                error=0;
            }
            catch(err){
                console.log("Error al modificar al cliente"+err);
            }
        }
    }    
    return error;
}

async function borrarCliente(id){
    var error=1;
    var client= await buscarPorID(id);
    if(client!=undefined){
        try{
            await conexion.doc(id).delete();
            console.log("Registro borrado");
            error=0;
        }
        catch(err){
            console.log("Error al borrar al cliente"+err);
        }
    }   
    return error;
}





module.exports={
    mostrarClientes,
    buscarPorID,
    nuevoCliente,
    modificarCliente,
    borrarCliente,
    verificarCredenciales
}