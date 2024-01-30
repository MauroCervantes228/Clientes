class Cliente{
    constructor(id, data){
        this.bandera=0;
        this.id=id;
        this.nombre=data.nombre;
        this.cliente=data.cliente;
        this.password=data.password;
        this.salt=data.salt;
        this.foto=data.foto;
        this.admin=data.admin;
    }
    
    set id(id){
        if(id!=null)
            id.length>0?this._id=id:this.bandera=1; 
    }
    set nombre(nombre){
        nombre.length>0?this._nombre=nombre:this.bandera=1;
    }
    set password(password){
        password.length>0?this._password=password:this.bandera=1;
    }
    set salt(salt){
        salt.length>0?this._salt=salt:this.bandera=1;
    }

    set cliente(cliente){
        cliente.length>0?this._cliente=cliente:this.bandera=1;
    }

    set foto(foto){
        foto.length>0?this._foto=foto:this.bandera=1;
    }

    set admin(admin){
        this._admin=admin;
    }

    get id(){
        return this._id;
    }
    get nombre(){
        return this._nombre;
    }
    get password(){
        return this._password;
    }
    get salt(){
        return this._salt;
    }

    get cliente(){
        return this._cliente;
    }

    get foto(){
        return this._foto;
    }

    get admin(){
        return this._admin;
    }

    get obtenerDatos(){
        if(this._id!=null)
            return {
                id:this.id,
                nombre:this.nombre,
                cliente:this.cliente,
                password:this.password,
                salt:this.salt,
                foto:this.foto,
                admin:this.foto
            }
        else{
            return {
                nombre:this.nombre,
                cliente:this.cliente,
                password:this.password,
                salt:this.salt,
                foto:this.foto,
                admin:this.admin
            }
        }    
    }
}
module.exports=Cliente;