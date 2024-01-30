var ruta=require("express").Router();
var subirArchivos=require("../middlewares/subirArchivos");
var {mostrarClientes, nuevoCliente, modificarCliente, buscarPorID, borrarCliente}=require("../bd/clientesBD");
const fs = require('fs').promises;

ruta.get("/api/mostrarClientes",async(req, res)=>{
    var clientes=await mostrarClientes();
    //res.render("usuarios/mostrar",{usuarios});
    if(clientes.length>0)
        res.status(200).json(clientes); // res es para que muestre algo en pantalla 
    else{
        res.status(400).json("No hay clientes");
    }    
});

ruta.post("/api/nuevocliente",subirArchivos(),async(req,res)=>{
    //console.log(req.body);
    req.body.foto=req.file.originalname;
    var error=await nuevoCliente(req.body);
    console.log(error);
    if (error==0) {
        res.status(200).json("Cliente Registrado");
    }
    else{
        res.status(400).json("Datos Incorrectos");
    }
});

ruta.get("/api/buscarClientePorId/:id",async(req,res)=>{
    var client = await buscarPorID(req.params.id);//aqui recibo solo un usuario por id por eso es user
    //res.render("usuarios/modificar",{user});
    if (client=="") {
        res.status(400).json("No se encontró ese cliente");
    }
    else{
        res.status(200).json(client);
    }
});

ruta.post("/api/editarCliente",subirArchivos(),async(req,res)=>{
    //console.log(req.body);
    req.body.foto=req.file.originalname;
    var error=await modificarCliente(req.body);
    if(error==0){
        res.status(200).json("Cliente Actualizado");
    }
    else{
        res.status(400).json("Error al actualizar el cliente");
    }
});

/*ruta.get("/api/borrarUsuario/:id",async(req,res)=>{
    var error=await borrarUsuario(req.params.id);
    if(error==0){
        res.status(200).json("Usuario Borrado");
    }
    else{
        res.status(400).json("Error al borrar el usuario");
    }
});*/

ruta.get("/api/borrarCliente/:id", async (req, res) => {
    try {
      const client = await buscarPorID(req.params.id);
      if (!client) {
        return res.status(404).json("Cliente no encontrado");
      }
      await fs.unlink(`./web/images/${client.foto}`);
      const error = await borrarCliente(req.params.id);
      if (error === 0) {
        res.status(200).json("Cliente borrado");
      } else {
        res.status(400).json("Error al borrar el cliente");
      }
    } catch (error) {
      console.error('Error al borrar la foto o cliente:', error);
      res.status(500).json("Error al borrar la foto o cliente");
    }
  });

module.exports=ruta;