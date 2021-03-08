function Pajarraco(mundo, ancho, alto, sprite, posX, posY, velocidad){
		
	//Constructor padre tiene parametros; también hereda el prototype (mas abajo) para eredar los metodos geter y seter de las posición x e y
	Objeto.call(this,mundo,ancho,alto,sprite);  //similar a super, crea nuevas variables de objeto (las variables de objeto que crea el constructor de Personaje se crean gracias a call en el objeto Helicoptero pues el this se extrapola
	this.setX(posX);
	this.setY(posY);
	this.movimientoSprite="movimiento1";
	this.velocidad= this.mundo.velocidad/2*velocidad;
	this.indiceSprite=0;
	this.retardoSprite=5;
	this.contadorRetardo=0;
}

//hereda de personaje mediante prototype-chaining
Pajarraco.prototype= new Objeto;

Pajarraco.prototype.mover= function(delta){	
	this.setX(this.getX() - this.velocidad*this.mundo.delta);
	
}

Pajarraco.prototype.colision= function(){ //colision contra el jugador
	//helicoptero y pajarraco son 2x1 casillas pero hay una excepcion que es cuando el elicoptero está arriba y a la derecha pues debajo de la cola hay hueco
	if((this.mundo.jugador.getX()-this.getX())>0.4 && this.getY()-this.mundo.jugador.getY()>0.5) return false;//excepción de elicoptero arriba y a la derecha
	if((this.mundo.jugador.getX()-this.getX())>0.75 && this.mundo.jugador.getY()<this.getY()) return false; //excepción de elicoptero arriba y a la derecha
	if((this.getX()-this.mundo.jugador.getX())>1.65 && this.getY()-this.mundo.jugador.getY()>0.7) return false; //fina excepción de helicoptero arriba y a la izquierda (cabeza del ave es diagonal)
	if((this.getX()-this.mundo.jugador.getX())>1.5 && this.mundo.jugador.getY()-this.getY()>0.75) return false; //excepción de helicoptero abajo y a la izquierda
	if (Math.abs(this.getY()-this.mundo.jugador.getY())<0.85 && Math.abs(this.getX()-this.mundo.jugador.getX())<1.8) //un poco de margen mas
		return true;
	
}

Pajarraco.prototype.dibujar=function(contexto){
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