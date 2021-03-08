function Escudo(mundo, ancho, alto, sprite, posX, posY){
		
	//Constructor padre tiene parametros; también hereda el prototype (mas abajo) para eredar los metodos geter y seter de las posición x e y
	Objeto.call(this,mundo,ancho,alto,sprite);  //similar a super, crea nuevas variables de objeto (las variables de objeto que crea el constructor de Personaje se crean gracias a call en el objeto Helicoptero pues el this se extrapola
	this.setX(posX);
	this.setY(posY);
	this.movimientoSprite="movimiento1";
	this.indiceSprite=0;
	this.retardoSprite=10;
	this.contadorRetardo=0;
}

//hereda de personaje mediante prototype-chaining
Escudo.prototype= new Objeto;

Escudo.prototype.mover= function(delta){	
	//no se mueve
	
}

Escudo.prototype.colision= function(){ //colision contra el jugador
	//helicoptero y pajarraco son 2x1 casillas pero hay una excepcion que es cuando el elicoptero está arriba y a la derecha pues debajo de la cola hay hueco
	if (Math.abs(this.getY()-this.mundo.jugador.getY())<0.9 && Math.abs(this.getX()-this.mundo.jugador.getX())<1.4)
		return true;
}

Escudo.prototype.dibujar=function(contexto){
	//contexto.drawImage(this.sprite[this.movimiento][indiceSprite],
	contexto.save();
	//contexto.translate(Math.floor(this.x),Math.floor(this.y));
	contexto.translate(Math.floor((this.getX()-this.mundo.recorrido)*this.mundo.anchoCelda),Math.floor(this.getY()*this.mundo.altoCelda)); //desplazamiento es una constante y es el desplazamiento con respecto al margen de la pantalla
	
	this.sprite.dibujar(contexto,this.ancho,this.alto,this.movimientoSprite,this.indiceSprite);
	
	contexto.restore();
	this.contadorRetardo++;
	if(this.contadorRetardo%this.retardoSprite==0)
		this.indiceSprite= (this.indiceSprite==this.sprite.getNumSprites(this.movimientoSprite)-1)?0:(this.indiceSprite+1);
	
	
}