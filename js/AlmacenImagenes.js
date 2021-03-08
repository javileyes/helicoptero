function AlmacenImagenes(){
    //La lista de objetos Image
    this.lista=[];
    this.esperadas=0;
    this.cargadas=0;
}
AlmacenImagenes.prototype.cargar=function(lista){
    var self=this;
    this.esperadas=lista.length;
    for (var i=0;i<this.esperadas;i++)
    {
        var img=new Image();
        img.src=lista[i][1];
        img.onload=function(){
            self.imagenCargada();
        };
        this.lista[lista[i][0]]=img;
    }
};
AlmacenImagenes.prototype.imagenCargada=function(){
    this.cargadas++;
    if (this.cargadas==this.esperadas)
    {
        this.completado();
    }
};
AlmacenImagenes.prototype.get=function(id){
    return this.lista[id];
};
AlmacenImagenes.prototype.completado=function(){};// JavaScript Document