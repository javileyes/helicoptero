function Tile(ancho, alto, caminable, img, coordenadas, anchoOrigen, altoOrigen){
    this.ancho=ancho;
    this.alto=alto;
    this.caminable=caminable;
    this.imagen=img;
	this.coordenadasOrigen= coordenadas;
	this.anchoOrigen=anchoOrigen;
	this.altoOrigen=altoOrigen
}
Tile.prototype.dibujar=function(contexto,x,y){
    //contexto.fillStyle = "#444";
    //contexto.fillRect(this.ancho*x,this.alto*y,this.ancho,this.alto);
    //contexto.fillStyle = this.color;
    //contexto.fillRect(this.ancho*x+1,this.alto*y+1,this.ancho-2,this.alto-2);
	contexto.drawImage(this.imagen,this.coordenadasOrigen[0],this.coordenadasOrigen[1], this.anchoOrigen, this.altoOrigen, x, y, this.ancho,this.alto);
}