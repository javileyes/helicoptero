function Objeto(mundo, ancho, alto, sprite){
	this.mundo=mundo;	
	this.ancho=ancho;
	this.alto=alto;
	this.sprite=sprite;

}



Objeto.prototype.setX= function(x){
	this.x=x;	
}

Objeto.prototype.getX= function(){
	return(this.x);	
}

Objeto.prototype.setY= function(y){
	this.y=y;	
}

Objeto.prototype.getY= function(){
	return(this.y);	
}