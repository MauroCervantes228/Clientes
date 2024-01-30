var express=require("express");
var cors=require("cors");
var path=require("path");
var session=require("cookie-session");
require("dotenv").config();
var rutasClientes=require("./rutas/clientesRutas");
var rutasClientesApis=require("./rutas/clientesRutasApis");




var app=express();
app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(session({
    name:'session',
    keys:["asdlfkhoiweniidk"],
    maxAge: 24 * 60 * 60 * 1000
}));

app.use("/",express.static(path.join(__dirname,"/web")));
app.use("/",rutasClientes);
app.use("/",rutasClientesApis);


var port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});