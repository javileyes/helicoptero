function Helicoptero(mundo, ancho, alto, sprite, spriteEscudo, posX){
		
	//Constructor padre tiene parametros; también hereda el prototype (mas abajo) para eredar los metodos geter y seter de las posición x e y
	Objeto.call(this,mundo,ancho,alto, sprite);  //similar a super, crea nuevas variables de objeto (las variables de objeto que crea el constructor de Personaje se crean gracias a call en el objeto Helicoptero pues el this se extrapola
	this.spriteEscudo= spriteEscudo;
	//la posición x depende del recorrido del mundo
	this.setY(posX); //inicializa la Y para que el helicoptero comience en alto
	this.movimientoSprite="movimiento1"; //de momento solo tiene ese movimiento de sprite
	
	this.maxVelocidadVertical=0.017;//fRedimension; //maxima abosoluta, tanto en ascenso como en descenso
	this.velocidadVertical=-this.maxVelocidadVertical/3; //el helicoptero empieza con aceleracion maxima hacia arriba
	this.acelerando=false;
	this.indiceAceleracionRapido= 0.04;//0.075 y 0.035
	this.indiceAceleracionLento= 0.025; //para velocidades cercanas a 0, proporciona estabilidad en el vuelo
	this.indiceAceleracionMuyLento= 0.015; //para velocidades cercanas a 0, proporciona estabilidad en el vuelo
	this.indiceAceleracionMuyRapido= 0.1; //para desacelerar o acelerar rápidamente para contrarestar, da manejo del helicoptero
	this.velocidadHorizontal=0;//para cuando queramos que el juego nos avance el elicoptero hacia adelanto o atras
	this.velocidadHorizontalTipica= 0.002;
	this.indiceSprite=0;
	this.desplazamiento=0; //desplazamiento horizontal (normal) en casillas con respecto al margen de la pantalla
	this.desplazamientoNuevo=2; //desplazamiento 
	this.topeSuperior=0.6; //tope superior de la pantalla donde el helicoptero para su ascensión 60% de una casilla (hay que tener en cuenta que el (x,y) de un objeto es el centro de ese objeto
	//this.tilesPermitidos=[];
	this.estado="normal"; //"escudo"
	
}

//hereda de personaje mediante prototype-chaining
Helicoptero.prototype= new Objeto;
//llama al constructor pero sin pasarle parámetros: el objeto prototype se crea a partir de un nuevo objeto Personaje que incluye 
//el prototype de la propia clase Personaje más las variables que se definen en el constructor de Personaje pero con valor undefined pues se ha llamado sin parámetros


Helicoptero.prototype.colision= function(){
	//calcular coordenadas de casilla de mapa donde se encuentra el centro del helicoptero
	var casillaX= this.mundo.casillasRecorridas+ Math.floor(this.desplazamiento); ///el helicoptero se encontrara en la x que se ha desplazado el mundo hasta ahora + la separación con respecto al borde
	var casillaY= Math.floor(this.getY());
	//PRECAUCIÓN ESTE PARTE DE CÓDIGO DEPENDE (POR SIMPLICAR) DE LAS DIMENSIONES DEL HELICOPTERO, SUPONEMOS HELICOPTERO 2X1 CASILLAS
	//como sabemos que el helicoptero mide 2 casillas de ancho x 1 de alto podemos atajar la comprobación de colisiones:
	//miramos si hay colision en la casilla actual y en la de delante, nunca en la de atras pues el helicoptero solo avanza
	
	//primero miramos en la casilla actual
	if (this.mundo.conjuntoTiles[this.mundo.mapa[casillaY][casillaX]].caminable==false){
			return true; //alert("SAN SEACABO!!!");
	}
	//miramos si el centro del helicoptero esta en la mitad inferior o la mitad superior de la casilla
	if (this.getY()-casillaY > 0.5){
		//miramos si hay colisión con la casilla de abajo
		if (this.mundo.conjuntoTiles[this.mundo.mapa[casillaY+1][casillaX]].caminable==false) 
			return true; //alert("SAN SEACABO!!!");
	
		//si está en la mitad inferior fijarse en la casilla de atras pues la cola puede estar tocando si estamos bajando
		//como la cola está alta le damos un margen del +50%
		if (casillaX>0 && this.getY()-casillaY > 0.75&& mundo.conjuntoTiles[this.mundo.mapa[casillaY+1][casillaX-1]].caminable==false)
			return true; //alert("SAN SEACABO!!!");
			
		
	}
	else {
			//miramos si hay colisión con la casilla de arriba
			if (this.mundo.conjuntoTiles[this.mundo.mapa[casillaY-1][casillaX]].caminable==false) 
				return true; //alert("SAN SEACABO!!!");
				
			//si está en la mitad superior fijarse en la casilla de atras pues la cola puede estar tocando si estamos subiendo
			if (this.mundo.mapa[casillaY-1]!=undefined&&this.mundo.conjuntoTiles[this.mundo.mapa[casillaY-1][casillaX-1]].caminable==false)
				return true; //alert("SAN SEACABO!!!");
	}
	
	//ahora miramos en la casilla de delante (pues el elicoptero mide 2 casillas de largo y aún estando su centro casi al principio de la primera casilla invadiría la segunda)
	if (this.mundo.conjuntoTiles[this.mundo.mapa[casillaY][casillaX+1]].caminable==false)
			return true; //alert("SAN SEACABO!!!");
	//miramos si el centro del helicoptero esta en la mitad inferior o la mitad superior de la casilla
	if (this.getY()-casillaY > 0.5){
		if (mundo.conjuntoTiles[this.mundo.mapa[casillaY+1][casillaX+1]].caminable==false)
			return true; //alert("SAN SEACABO!!!");
	}
	else {
			if (this.mundo.conjuntoTiles[this.mundo.mapa[casillaY-1][casillaX+1]].caminable==false)
				return true; //alert("SAN SEACABO!!!");
	}	
	return false;
	
}

Helicoptero.prototype.mover= function(delta){
	if(this.desplazamientoNuevo>this.desplazamiento) this.velocidadHorizontal= this.velocidadHorizontalTipica; 
	else if(this.desplazamientoNuevo>this.desplazamiento) this.velocidadHorizontal= -this.velocidadHorizontalTipica; 
		 else this.velocidadHorizontal=0;
	this.setX(this.mundo.recorrido+ this.desplazamiento+ this.velocidadHorizontal*delta); ///mundo recorrido son las celdas recorridas mas el pico y a eso le sumamos la proporcionalidad en celdas que supone el desplazamiento respecto al borde (¿70px cuantas casillas y pico de casilla es?)
	this.desplazamiento= this.desplazamiento+ this.velocidadHorizontal*delta;
	
	var indiceAceleracion;
	if(Math.abs(this.velocidadVertical)<this.maxVelocidadVertical/10) 
		indiceAceleracion= this.indiceAceleracionMuyLento;
		else 	if(Math.abs(this.velocidadVertical)<this.maxVelocidadVertical/3) 
		indiceAceleracion= this.indiceAceleracionLento;
		else if(this.velocidadVertical<0 && this.acelerando || this.velocidadVertical>0 && !this.acelerando) //si la velocidad es considerable >maxVel/3 se aplica una aceleracion rápida si vamos a favor para conseguir dominio y rapidez
			    indiceAceleracion= this.indiceAceleracionRapido;
		        else indiceAceleracion=this.indiceAceleracionMuyRapido; //si vamos a una velocidad rápida >maxvelo/3 y queremos cambiar de direccion se aplica la máxima de las aceleraciones para contrarrestar: proporciona estabilidad
	this.velocidadVertical+= (this.acelerando)?-indiceAceleracion*this.maxVelocidadVertical:+indiceAceleracion*this.maxVelocidadVertical;
	if(this.velocidadVertical>this.maxVelocidadVertical) this.velocidadVertical=this.maxVelocidadVertical;
	if(this.velocidadVertical<-this.maxVelocidadVertical) this.velocidadVertical=-this.maxVelocidadVertical;
	this.setY(this.getY() + this.velocidadVertical*delta);
	if (this.getY()<this.topeSuperior) {this.setY(this.topeSuperior); this.velocidadVertical/=2}; //no se puede sobrepasar el tope de la pantalla
	
}

Helicoptero.prototype.dibujar=function(contexto){
	//contexto.drawImage(this.sprite[this.movimiento][indiceSprite],
	contexto.save();
	//contexto.translate(Math.floor(this.x),Math.floor(this.y));
	contexto.translate(this.desplazamiento*this.mundo.anchoCelda,Math.floor(this.getY()*this.mundo.altoCelda)); //desplazamiento es una constante y es el desplazamiento con respecto al margen de la pantalla
	
	if (this.estado=="normal"){
		this.sprite.dibujar(contexto,this.ancho,this.alto,this.movimientoSprite,this.indiceSprite); //con escudo multiplicar por 1.27  1.73
	}
	else if (this.estado=="escudo"){
		this.spriteEscudo.dibujar(contexto,1.27*this.ancho,1.73*this.alto,this.movimientoSprite,this.indiceSprite);
	}
	contexto.restore();
	this.indiceSprite= (this.indiceSprite==this.sprite.getNumSprites(this.movimientoSprite)-1)?0:(this.indiceSprite+1);
	
	
}