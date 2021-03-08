function Murcielago(mundo, ancho, alto, sprite, posX, posY, velocidad){
		
	//Constructor padre tiene parametros; también hereda el prototype (mas abajo) para eredar los metodos geter y seter de las posición x e y
	Objeto.call(this,mundo,ancho,alto,sprite);  //similar a super, crea nuevas variables de objeto (las variables de objeto que crea el constructor de Personaje se crean gracias a call en el objeto Helicoptero pues el this se extrapola
	this.setX(posX);
	this.setY(posY);
	this.movimientoSprite="movimiento1";
	this.velocidad= this.mundo.velocidad/2*velocidad;
	this.indiceSprite=0;
	this.retardoSprite=5;
	this.contadorRetardo=0;
	this.contadorMovimiento=0;
	this.rafagaMovimiento=5; //el murcielago es aleatorio y por rafagas si toca derecha irá a la derecha durante un numero de rafaga de tiempos
	this.direccion=0; //0:arriba; 1:abajo; 2:derecha; 3:izquierda
}

//hereda de personaje mediante prototype-chaining
Murcielago.prototype= new Objeto;

Murcielago.prototype.mover= function(delta){
	if(this.contadorMovimiento%this.rafagaMovimiento==0){
		 this.direccion= Math.floor(Math.random()*4)	//calculamos aleatoriamente la nueva dirección a seguir
	}
	switch(this.direccion){
		case(0): if(this.getY() - this.velocidad*this.mundo.delta>0.5) this.setY(this.getY() - this.velocidad*this.mundo.delta); break;
		case(1): if(this.getY() + this.velocidad*this.mundo.delta<this.mundo.mapa.length-0.5)this.setY(this.getY() + this.velocidad*this.mundo.delta); break;
		case(2): this.setX(this.getX() + this.velocidad*this.mundo.delta); break;
		case(3): this.setX(this.getX() - this.velocidad*this.mundo.delta); break;
	}
	this.contadorMovimiento++;
}

Murcielago.prototype.colision= function(){ //colision contra el jugador
	//helicoptero tiene 2 casillas pero murcielago sol 1 casillas (hay 1.5 casillas en horizontal de separacion para el choque)
	if(this.getY()-this.mundo.jugador.getY()>0.5 && this.indiceSprite!=1) return false;//excepcion cuando el murcielago tiene las alas bajas: si estamos arriba por mas de 0.5 y murcielago tiene alas bajas no nos llega a tocar (nota: el indice de sprite es +1 pues acaba de avanzar)
	if((this.mundo.jugador.getX()-this.getX())>0.5 && this.getY()-this.mundo.jugador.getY()>0.5) return false; //excepción de elicoptero arriba y a la derecha
	if((this.mundo.jugador.getX()-this.getX())>0.5 && this.getY()-this.mundo.jugador.getY()>0.25 && this.indiceSprite!=1) return false; //excepción de elicoptero arriba y a la derecha y murcielago con las alas bajas
	if((this.getX()-this.mundo.jugador.getX())>0.95 && this.getY()-this.mundo.jugador.getY()>0.4) return false; //excepción de elicoptero arriba y a la izquierda 
	if (Math.abs(this.getY()-this.mundo.jugador.getY())<0.9 && Math.abs(this.getX()-this.mundo.jugador.getX())<1.4) //un poco de margen mas
		return true;
	
}

Murcielago.prototype.dibujar=function(contexto){
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