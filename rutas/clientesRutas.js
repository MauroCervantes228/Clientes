var ruta=require("express").Router();
var subirArchivos=require("../middlewares/subirArchivos");
var {autorizado, admin}=require("../middlewares/funcionesPassword");
var {mostrarClientes, nuevoCliente, modificarCliente, buscarPorID, borrarCliente, verificarCredenciales}=require("../bd/clientesBD");
const fs = require('fs').promises;

ruta.get('/', (req, res) => {
    res.render('clientes/login');
  });
  
  ruta.post('/login', async (req, res) => {
    const { cliente, password } = req.body;
    
    const client = await verificarCredenciales(cliente, password);
  
    if (client) {
      req.session.isLoggedIn = true;
      res.redirect("/mostrar");
    } else {
      res.render('clientes/login', { error: 'Credenciales incorrectas' });
    }
  });

 ruta.get("/logout", (req, res)=>{
    req.session=null;
    res.redirect("/");  
 }) 

ruta.get("/mostrar",/*autorizado,*/async(req, res)=>{
    var clientes=await mostrarClientes();
    res.render("clientes/mostrar",{clientes});
});

ruta.get("/nuevocliente",async(req,res)=>{
    res.render("clientes/nuevo");
});

ruta.post("/nuevocliente",subirArchivos(),async(req,res)=>{
    console.log(req.file);
    req.body.foto=req.file.originalname;
    console.log(req.body);
    var error=await nuevoCliente(req.body);
    //res.end();
    res.redirect("/");
});

ruta.get("/editar/:id",async(req,res)=>{
    var client = await buscarPorID(req.params.id);
    res.render("clientes/modificar",{client});
});

ruta.post("/editar",subirArchivos(),async(req,res)=>{
    if (req.file!=undefined){
        req.body.foto=req.file.originalname;    
    }
    else {
        req.body.foto=req.body.fotoVieja;
    }
    var error=await modificarCliente(req.body);
    res.redirect("/");
});

/*ruta.get("/borrar/:id",async(req,res)=>{
    await borrarUsuario(req.params.id);
    res.redirect("/");
});*/
ruta.get("/borrar/:id", async (req, res) => {
    try {
      const client = await buscarPorID(req.params.id);
      if (!client) {
        return res.status(404).send("Cliente no encontrado");
      }
      await fs.unlink(`./web/images/${client.foto}`);
      await borrarCliente(req.params.id);
  
      res.redirect("/");
    } catch (error) {
      console.error('Error al borrar la foto del cliente:', error);
      res.status(500).send("Error al borrar la foto del cliente");
    }
  });

module.exports=ruta;