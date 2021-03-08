function AlmacenSprites(){
    //La lista de sprites
    this.lista=[];
}
AlmacenSprites.prototype.add=function(id,sprite){
    this.lista[id]=sprite;
}
AlmacenSprites.prototype.get=function(id){
    return this.lista[id];
}// JavaScript Document