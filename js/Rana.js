function Rana(mundo, ancho, alto, sprite, posX, posY, maxAltura){
		
	//Constructor padre tiene parametros; también hereda el prototype (mas abajo) para eredar los metodos geter y seter de las posición x e y
	Objeto.call(this,mundo,ancho,alto,sprite);  //similar a super, crea nuevas variables de objeto (las variables de objeto que crea el constructor de Personaje se crean gracias a call en el objeto Helicoptero pues el this se extrapola
	this.setX(posX);
	this.setY(posY);
	this.movimientoSprite="movimiento1";
	this.maxAltura=Math.floor(maxAltura*1.25); //le ponemos un 20% mas para que salten un poco mas
	//this.velocidad= this.mundo.velocidad/2*velocidad;
	this.indiceSprite=1;
	//this.retardoSprite=5;
	//this.contadorRetardo=0;
	//this.contadorMovimiento=0;
	//this.rafagaMovimiento=5; //el murcielago es aleatorio y por rafagas si toca derecha irá a la derecha durante un numero de rafaga de tiempos

	this.velocidadX;
	this.velocidadY;
	this.tiempo=0; //tiempo acumulado en el salto
	this.gravedad=0.1; //0.045 cuanto mas se ponga mas rápida irá las ranas
	this.estado=0; //la rana está en el suelo (0:suelo; 1,2,3...15:preparandose; 16:en el aire)
}

//hereda de personaje mediante prototype-chaining
Rana.prototype= new Objeto;

Rana.prototype.mover= function(delta){
	
	if(this.estado==0){
		this.velocidadX=0;
		this.velocidadY=0;
		this.indiceSprite=1; //sprite de la rana en el suelo
		var iniciativa= Math.floor(Math.random()*15*(1+(this.mundo.factorAnchura-4/3)*2)); ///la rana salta solo si el azar lo quiere
		if(iniciativa==0){
			 this.estado=1;
			 this.tiempo=0;
			 //calculamos los parametros fisicos del salto
			 var angulo= (Math.random()*Math.PI/4)+Math.PI/4; //(45-90) grados
			 var alturaMaxima= Math.floor(Math.random()*this.maxAltura)+2; //(2-maxAltura+1)
			 this.velocidadY=this.gravedad*Math.sqrt(alturaMaxima*40*2/this.gravedad); //velocidad vertical inicial para poder conseguir la altura exigida
			 var velocidad= this.velocidadY/Math.sin(angulo);
			 this.velocidadX= velocidad*Math.cos(angulo);
		}
		
	}
	else if(this.estado>0 && this.estado<=15){ 
			if(this.estado<=8) this.indiceSprite=2;
			else if(this.estado<=15) this.indiceSprite=1;
			this.estado++;
			if(this.estado==16){
				 this.indiceSprite=0; //sprite de rana volando
				 this.tiempo=0;
			}
		}
	else if(this.estado==16){ //si está en el aire
		this.tiempo+=delta;
		this.setY(this.getY() - (this.velocidadY*delta/1000 - 1/2*this.gravedad*this.tiempo*this.tiempo/1000000*2)); ///*2 es lo real podemos trastear el ultimo numero (1.75) menos la rana salta menos y permanece menos tiempo en le aire
		this.setX(this.getX() - this.velocidadX*delta/1000);
		//ver si toca suelo
		var casillaX= Math.floor(this.getX());
		var casillaY= Math.floor(this.getY());
		if (this.getY()-casillaY > 0.5){// si el centro de la rana está más allá de la mitad de la casilla podemos estando tocando suelo
			if (this.mundo.mapa[casillaY+1]!=undefined && this.mundo.conjuntoTiles[this.mundo.mapa[casillaY+1][casillaX]].caminable==false){
			    this.estado=0;
			}
		}
	}

}

Rana.prototype.colision= function(){ //colision contra el jugador
	//helicoptero tiene 2 casillas pero murcielago sol 1 casillas (hay 1.5 casillas en horizontal de separacion para el choque)
	if(this.getY()-this.mundo.jugador.getY()>0.65 && this.indiceSprite!=0) return false;//excepcion cuando la rana está en el suelo (está mas agazapada)
	if((this.mundo.jugador.getX()-this.getX())>0.25 && this.getY()-this.mundo.jugador.getY()>0.45) return false; //excepción de helicoptero arriba y a la derecha
	if((this.getX()-this.mundo.jugador.getX())>0.8 && this.mundo.jugador.getY()-this.getY()>0.6) return false; //excepción de helicoptero abajo y a la izquierda (la rana tiene que estar saltando)
	if((this.mundo.jugador.getX()-this.getX())>0.5 && this.getY()-this.mundo.jugador.getY()>0.35 && this.indiceSprite!=0) return false; //excepción de elicoptero arriba y a la derecha y rana en el suelo
	//if((this.getX()-this.mundo.jugador.getX())>0.95 && this.getY()-this.mundo.jugador.getY()>0.4) return false; //excepción de helicoptero arriba y a la izquierda 
	if (Math.abs(this.getY()-this.mundo.jugador.getY())<0.9 && Math.abs(this.getX()-this.mundo.jugador.getX())<1.4) //un poco de margen mas
		return true;
	
}

Rana.prototype.dibujar=function(contexto){
	//contexto.drawImage(this.sprite[this.movimiento][indiceSprite],
	contexto.save();
	//contexto.translate(Math.floor(this.x),Math.floor(this.y));
	contexto.translate(Math.floor((this.getX()-this.mundo.recorrido)*this.mundo.anchoCelda),Math.floor(this.getY()*this.mundo.altoCelda)); //desplazamiento es una constante y es el desplazamiento con respecto al margen de la pantalla
	
	this.sprite.dibujar(contexto,this.ancho,this.alto,this.movimientoSprite,this.indiceSprite);
	
	contexto.restore();
	//this.contadorRetardo++;
	//if(this.contadorRetardo%this.retardoSprite==0)
	//	this.indiceSprite= (this.indiceSprite==this.sprite.getNumSprites(this.movimientoSprite)-1)?0:(this.indiceSprite+1);
	
	
}