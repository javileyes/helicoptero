function Mundo(idCanvas, anchoCelda, altoCelda){
    this.canvas=document.getElementById(idCanvas);
    this.contexto=this.canvas.getContext('2d');
    
    this.anchoCelda=anchoCelda;
    this.altoCelda=altoCelda;
	this.velocidad=0.007; //velocidad minima si ponemos el intervalo a 25 mseg 
	this.recorrido;
	this.VIDAS=5;
	this.vidas=this.VIDAS;
	this.noRepetirVida= new Array;
	this.checkpoint={"x":0, "y":3}; //punto de partida
  
    //this.conjuntoTiles=[new Tile(this.anchoCelda,this.altoCelda,true,"white"),new Tile(this.anchoCelda,this.altoCelda,false,"black")];
	
	function asociar_tiles(mapa, ancho, alto){	
		var tiles= new Array;
		var map= mapa.layers[0].data;
		var sets= mapa.tilesets;
		//var columnas;
		//var filas;
		
		for(var i=0; i<map.length; i++)
		{
			var id= map[i];
			var j=0;
			while(id>sets[j].firstgid && j<sets.length-1 && id>sets[j+1].firstgid) j++;
			var casilla= id - sets[j].firstgid;
			
			if(sets[j].tileproperties!=undefined && sets[j].tileproperties[casilla.toString()]!=undefined)
				var caminable= (sets[j].tileproperties[casilla.toString()].seguro=="true")?true:false;
			else caminable=false;
			//columnas= sets[i].imagewidth/(sets[i].tilewidth+sets[i].margin);
			//filas= sets[i].imageheight/(sets[i].tileheight+sets[i].margin);
			//coorArIzX=id/columnas*(sets[i].tilewidth+sets[i].margin);
			//coorArIzY=id%columnas*(sets[i].tileheight+sets[i].margin);
			if (tiles[id]=== undefined) {
			var coorArIz= new Array;
			coorArIz[0]= casilla*(sets[j].tilewidth+sets[j].margin)%(sets[j].imagewidth-2)+2;       //+0.05 para que no redondee para abajo el 0.965 (de la primera columna (casilla 18,36...)) 
			coorArIz[1]= Math.floor((casilla*(sets[j].tilewidth+sets[j].margin)/sets[j].imagewidth)+0.05) * (sets[j].tileheight+sets[j].margin)+2;
			var tile= new Tile(ancho, alto, caminable, Imagenes.get(sets[j].image), coorArIz, sets[j].tilewidth, sets[j].tileheight);
			tiles[id]=tile;
			}
		}
		return tiles;
	}
	
	//recolecta los objetos que contiene el mapa y los ordena segun la distancia en el mundo
	function organizar_objetos(mapa){ //ancho y alto de las celdas del mundo
		var listaObjetos= new Array;
		var listaObjetosOrdenada= new Array;
		var objetos= mapa.layers[1].objects;
		for(var i=0; i<objetos.length; i++){
			var tipo= objetos[i].name;
			var posX= objetos[i].x/objetos[i].width;
			var posY= objetos[i].y/objetos[i].height;
			var velocidad=1; //velocidad normal
			var especial=0; //propiedad especial que pueda tener cada objeto
			if(objetos[i].properties.velocidad!=undefined){ //si tiene una velocidad especial
				velocidad= objetos[i].properties.velocidad; //hay objetos del mapa que pueden tener velocidades diferentes a la del tipo de criatura o cosa que representa p.e si un pajaro tiene 1.25 de velocidad es que va un 25% mas rápido que un pajaro normal que se supone velocidad 1 (1*velocidadNormal_del_pajaro)
			}
			if(objetos[i].properties.especial!=undefined){ //si tiene una velocidad especial
				especial= objetos[i].properties.especial; //hay objetos del mapa que pueden tener velocidades diferentes a la del tipo de criatura o cosa que representa p.e si un pajaro tiene 1.25 de velocidad es que va un 25% mas rápido que un pajaro normal que se supone velocidad 1 (1*velocidadNormal_del_pajaro)
			}
			
			listaObjetos.push({"tipo": tipo, "x":posX, "y":posY, "velocidad":velocidad, "especial":especial});
		}
		while (listaObjetos.length>0){
			var masCercano=0;
			var distanciaCercana= listaObjetos[0].x;
			for(var i=0; i<listaObjetos.length; i++){
				if (listaObjetos[i].x < distanciaCercana){
					distanciaCercana= listaObjetos[i].x;
					masCercano=i;
				}
			}
			listaObjetosOrdenada.push(listaObjetos.splice(masCercano,1)[0]); //arranca el objeto más cercano y lo inserta en el array ordenado
						
		}
		return listaObjetosOrdenada;
	}
	
	function mapa_bidimensional(mapa)
	{
		var columnas= mapa.width;
		var filas= mapa.height;
		var bidimensional= new Array;
		var map= mapa.layers[0].data;
		for(var i=0; i<filas; i++){
			bidimensional[i]= new Array;
			for(var j=0; j<columnas; j++){
				bidimensional[i][j]= map[i*columnas+j];
					
			}
		}
		return bidimensional;
	}
	
	//SENTENCIAS INICIALES DEL CONSTRUCTOR DE MUNDO
	this.conjuntoTiles=asociar_tiles(mapa1, anchoCelda, altoCelda);	
    this.mapa= mapa_bidimensional(mapa1);
	this.reservaObjetos= organizar_objetos(mapa1); //lista de los objetos que se iran activando conforme se alcance su posición

	
    
    //dimensionamos canvas la altura del cavas es el alto de la celda * número de casillas; la anchura es 4/3 de la altura (4/3 de 15 casillas sale entero con las casillas la ultima casilla cabe entera aunque no importa mucho que quepa entera)
	this.factorAnchura=7/4; ///5/3  4/3
    this.canvas.height=altoCelda*this.mapa.length;
	this.canvas.width=(this.factorAnchura)*this.canvas.height;   
	
	//this.start(this.checkpoint);
	this.simulacion();
	
}

Mundo.prototype.dibujarMapa=function(){
	//dibujar fondo
    var y=this.mapa.length;
	this.contexto.fillStyle = '#000000';
	this.contexto.fillRect(0,0,y*this.anchoCelda*(this.factorAnchura),y*this.altoCelda) ///la altura de la pantalla es el alto de la celda * número de casillas; el ancho de la pantalla es 4/3 del alto
    //la x es la maxima coordenada x (dentro de la parte visible) de celda de mapa bidimensional +1 para que no se vea la frontera sinuseante
	var x=this.casillasRecorridas+(this.factorAnchura)*y+1; 
    for (var yi=0;yi<y;yi++)
    {
        for (var xi=this.casillasRecorridas;xi<x;xi++)
        {
            //this.conjuntoTiles[this.mapa[yi][xi]].dibujar(this.contexto,xi,yi);
			this.conjuntoTiles[this.mapa[yi][xi]].dibujar(this.contexto,Math.floor((xi-this.recorrido)*this.anchoCelda),yi*this.altoCelda);
        }																			//le resto el recorrido en pi
    }
	//dibujar las vidas abajo a la izquierda (iconos pequeños de helicoptero
	var imagenHeli=Imagenes.get("heli.png");
	for (var i=0; i<this.vidas; i++) this.contexto.drawImage(imagenHeli,21,15, 64, 25, i*this.anchoCelda/2*1.2, (y-0.5)*this.altoCelda, this.anchoCelda/2,this.altoCelda/2);
}

Mundo.prototype.moverObjetos=function(delta){
	//primero comprobar si hay nuevos objetos para activar (creando un objeto viviente (instancia con new) a partir del repositorio)
	//en el caso de que el reservorio no se haya completado
	
	while(this.reservaObjetos.length> this.reservaObjetos.siguiente && 
		  this.reservaObjetos[this.reservaObjetos.siguiente].x<this.casillasRecorridas + (this.factorAnchura)*this.mapa.length+1){
		var obj= this.reservaObjetos[this.reservaObjetos.siguiente];
		switch(obj.tipo){
			case("pajarraco"):
			  this.listaObjetosActivos.push(new Pajarraco(this, 2*this.anchoCelda, this.altoCelda, Sprites.get("pajarraco"), obj.x, obj.y+0.5, obj.velocidad)); //+0.5 su posicion es el centro de la casilla	  
			break;
			case("murcielago"):
			  this.listaObjetosActivos.push(new Murcielago(this, this.anchoCelda, this.altoCelda, Sprites.get("murcielago"), obj.x, obj.y+0.5, obj.velocidad)); //+0.5 su posicion es el centro			  			
			break;
			case("checkpoint"):
			  this.listaObjetosActivos.push(new Checkpoint(this, this.anchoCelda, this.altoCelda, Sprites.get("checkpoint"), obj.x, obj.y+0.5)); //+0.5 su posicion es el centro			  			
			break;
			case("vida"):
			  if(this.noRepetirVida[obj.x]==undefined){
				  this.listaObjetosActivos.push(new Vida(this, this.anchoCelda, this.altoCelda, Sprites.get("vida"), obj.x, obj.y+0.5)); //+0.5 su posicion es el centro			  			
			  }
			break;
			case("escudo"):
			  this.listaObjetosActivos.push(new Escudo(this, this.anchoCelda, this.altoCelda, Sprites.get("escudo"), obj.x, obj.y+0.5)); //+0.5 su posicion es el centro			  			
			break;
			
			
			case("rana"):
			  this.listaObjetosActivos.push(new Rana(this, this.anchoCelda, this.altoCelda, Sprites.get("rana"), obj.x, obj.y+0.5, obj.especial)); //la rana tiene la propiedad especial de maxima altura que puede saltar		  			
			break;			
			
			default: console.log("tipo de objeto: "+ obj.tipo +" no válido")
			
		}
		//como el mundo siempre va hacia adelante el siguiente objeto a reanimar será el siguiente de la lista ordenada por distancia
		this.reservaObjetos.siguiente++;
	}
	
	//comprobar si hay objetos activos en la lista activa, en caso afirmativo moverlos
	if(this.listaObjetosActivos.length>0){
		for (var i=0; i<this.listaObjetosActivos.length; i++){
			//comprobamos si objeto está aun en el rango visible, de no ser así deja de estar activo y lo sacamos de la lista
			var cosa= this.listaObjetosActivos[i];
			if(	cosa.getX()< this.casillasRecorridas){
					this.listaObjetosActivos.splice(i--,1); //contrarestamos el i++ pues hemos eliminado 1 elemento
			}
			else //aun sigue activo lo movemos y lo dibujamos
			{
				cosa.mover(delta);
				cosa.dibujar(this.contexto);
				if (cosa.colision()){ 
					if(cosa instanceof(Checkpoint)){//si es un objeto bueno como el checkpoint no se pierden vidas
						this.checkpoint.x= cosa.getX() - this.jugador.desplazamiento; //para que el helicoptero empiece justo ahí
						this.checkpoint.y= cosa.getY();
						this.listaObjetosActivos.splice(i--,1); //se quita de la lista activa para que desaparezca
						
					}
					else if(cosa instanceof(Vida)){//si es un objeto bueno como el objeto vida no se pierden vidas, en este caso se gana una
						this.vidas++;
						this.noRepetirVida[cosa.getX()]=true; //para que las vidas no se repitan
						this.listaObjetosActivos.splice(i--,1);
					}
					else if(cosa instanceof(Escudo)){
						this.jugador.estado="escudo";
						this.listaObjetosActivos.splice(i--,1);
					}
					else{//si es un enemigo pero tenemos escudo:
						if(this.jugador.estado=="escudo"){
							this.jugador.estado="normal";
							this.listaObjetosActivos.splice(i--,1); //el enemigo desaparece (muere)
						}
						else{
							this.reiniciar();
						}
					}
				
				}				
			}
		}
		
	}
}



Mundo.prototype.iniciarHelicoptero=function(posY){
    this.jugador=new Helicoptero(this,2*this.anchoCelda, this.altoCelda, Sprites.get("helicoptero"), Sprites.get("helicopteroEscudo"), posY); //el elicoptero lo dibujaremos (2x1) dos casillas de ancho por una de alto (un poco mas alto que el png que solo tiene 27 px de alto)
    var self=this;
	this.handlerPulsaHelicopteroDown;
	this.handlerPulsaHelicopteroUp;

    
	
    this.canvas.addEventListener("mousedown", this.handlerPulsaHelicopteroDown=function(){
	     self.jugador.acelerando=true;	
	});
	
		
	
	this.canvas.addEventListener("mouseup", this.handlerPulsaHelicopteroUp=function(){
	     self.jugador.acelerando=false;	
	});
			
}

Mundo.prototype.imprimeMensaje=function(indiceAnchura,mensaje){
	this.contexto.font = "10px serif"; //partimos de una base para hacer los calculos
	var medida = this.contexto.measureText(mensaje);
	//this.contexto.font = "50px serif"
	this.contexto.fillStyle = "#FFFF00";
	var tamanoLetra= indiceAnchura*this.canvas.width*10/medida.width; //quiero que la letra ocupe 2/3 de la anchura
	this.contexto.font = tamanoLetra+"px serif";
	var medidaMensaje= medida.width*tamanoLetra/10;
	var xPosicion = (this.canvas.width/2) - (medidaMensaje/2);
//	this.contexto.fillText (mensaje, this.canvas.width/3.4, this.canvas.height/2);
	this.contexto.fillText (mensaje, xPosicion, this.canvas.height/2);
		
}



Mundo.prototype.pulseTecla=function(){
	
	var prePulsacion=false;
	var self=this;
	this.imprimeMensaje(2/3, "Push for continue");
	
	var retardar= function (){
	var prepulsa, pulsa; //handlers
	

    self.canvas.addEventListener("mousedown", prepulsa=function(){
		self.canvas.removeEventListener("mousedown", prepulsa); prePulsacion=true});
	
		
	
	self.canvas.addEventListener("mouseup", pulsa=function(){	     
		 if(prePulsacion){
			  
			  self.canvas.removeEventListener("mouseup", pulsa);
			  clearInterval(self.intervaloSimulado); //si hubiera una simulacion la termina
			  self.start(self.checkpoint);			  
		 }
	});
	}
	
	setTimeout(retardar,250);
	
}

Mundo.prototype.simulacion=function(posicion){
		var fundidoNegro=false;
		var contadorFundido=100;
		//funcion anidada
		var loopSimulacion=function(){
			if (fundidoNegro){
				if(--contadorFundido<0){ 
					fundidoNegro=false;
					contadorFundido=100;
					this.tiempoTranscurrido=new Date().getTime();
					//no se hace nada
				}
			}
			else{
				this.delta=(new Date().getTime()) - this.tiempoTranscurrido;  //console.log(this.delta);
				this.tiempoTranscurrido=new Date().getTime();
				//this.recorrido+=Math.floor(delta*this.velocidad);
				this.recorrido+= this.delta*this.velocidad;
				this.casillasRecorridas= Math.floor(this.recorrido);  //el resultado entero lo entenderemos como casillas avanzadas y así luego se realizará cuando dibujemos el mapa
				 
				this.dibujarMapa();
				this.moverObjetos(this.delta);
				this.imprimeMensaje(2/3, "Push for start");
				if(this.recorrido>550){
					this.recorrido=0;				
					this.reservaObjetos.siguiente=0; //posición del array que contiene el siguiente objeto que será activado (la lista está ordenada por cercanía del objeto)	
					this.listaObjetosActivos= new Array; //conforme se van activando los objetos de la reserva van pasando a esta lista
					fundidoNegro=true;
					//se dibuja un fundido en negro
					var y=this.mapa.length;
					this.contexto.fillStyle = '#000000';
					this.contexto.fillRect(0,0,y*this.anchoCelda*(this.factorAnchura),y*this.altoCelda); ///la altura de la pantalla es el alto de la celda * número de casillas; el ancho de la pantalla es 4/3 del alto
					this.imprimeMensaje(2/3, "Push for start");
					
				}
			}	
		}

		this.recorrido=0;
		this.jugador=new Helicoptero(this,2*this.anchoCelda, this.altoCelda, Sprites.get("helicoptero"), Sprites.get("helicopteroEscudo"), -1000); //crea helicoptero para que no de fallos la simulacion pero no lo pongo en escena
		this.reservaObjetos.siguiente=0; //posición del array que contiene el siguiente objeto que será activado (la lista está ordenada por cercanía del objeto)	
		this.listaObjetosActivos= new Array; //conforme se van activando los objetos de la reserva van pasando a esta lista
		//while(this.reservaObjetos.length> this.reservaObjetos.siguiente && this.reservaObjetos[this.reservaObjetos.siguiente].x<this.recorrido+6) this.reservaObjetos.siguiente++; //cuando empezamos en un checkpoint adelantamos a todos los anteriores
		this.tiempoTranscurrido=new Date().getTime();
//		this.intervalo=setInterval(function(){self.loop()},20);
        this.intervaloSimulado=setInterval(loopSimulacion.bind(this),20); //mejoramos claridad en codigo con la funcion del sistema "bind"
		this.pulseTecla();
	
}


Mundo.prototype.start=function(posicion){

		this.recorrido=posicion.x;
		this.iniciarHelicoptero(posicion.y);
		this.reservaObjetos.siguiente=0; //posición del array que contiene el siguiente objeto que será activado (la lista está ordenada por cercanía del objeto)	
		this.listaObjetosActivos= new Array; //conforme se van activando los objetos de la reserva van pasando a esta lista
		while(this.reservaObjetos.length> this.reservaObjetos.siguiente && this.reservaObjetos[this.reservaObjetos.siguiente].x<this.recorrido+6) this.reservaObjetos.siguiente++; //cuando empezamos en un checkpoint adelantamos a todos los anteriores
		this.tiempoTranscurrido=new Date().getTime();
//		this.intervalo=setInterval(function(){self.loop()},20);
        this.intervalo=setInterval(this.loop.bind(this),20); //mejoramos claridad en codigo con la funcion del sistema "bind"
	
}


Mundo.prototype.reiniciar=function(){
	clearInterval(this.intervalo);
	this.vidas--;
	if(this.vidas>0){
	  this.canvas.removeEventListener("mousedown",this.handlerPulsaHelicopteroDown);
	  this.canvas.removeEventListener("mouseup",this.handlerPulsaHelicopteroUp);
	  this.pulseTecla();
	}
	else{
		this.imprimeMensaje(2/3, "GAME OVER");
		var retardar= function(){
			this.checkpoint.x=0;
			this.checkpoint.y=3;
			this.vidas=this.VIDAS;
			this.noRepetirVida= new Array;
			this.simulacion();
		}
		setTimeout(retardar.bind(this),2000);
	}
}



Mundo.prototype.loop=function(){
	this.delta=(new Date().getTime()) - this.tiempoTranscurrido;  //console.log(this.delta);
	this.tiempoTranscurrido=new Date().getTime();
	//this.recorrido+=Math.floor(delta*this.velocidad);
	this.recorrido+= this.delta*this.velocidad;
	this.casillasRecorridas= Math.floor(this.recorrido);  //el resultado entero lo entenderemos como casillas avanzadas y así luego se realizará cuando dibujemos el mapa
	 
	this.dibujarMapa();
	this.jugador.mover(this.delta);
	this.jugador.dibujar(this.contexto);
	if (this.jugador.colision()){
				this.reiniciar();
		
	}
	else{
		this.moverObjetos(this.delta);
	
				 var p1=document.getElementById("p1");
			 p1.innerText=this.recorrido; 
	}
}

/*
//version del loop para depurar (independiente del tiempo
Mundo.prototype.loop=function(){
  this.jugador.acelerando=true;
  while (true){
	this.delta= 20;

	this.recorrido+= this.delta*this.velocidad;
	this.casillasRecorridas= Math.floor(this.recorrido);  //el resultado entero lo entenderemos como casillas avanzadas y así luego se realizará cuando dibujemos el mapa
	 
	this.dibujarMapa();
	this.moverObjetos(this.delta);
	this.jugador.mover(this.delta);
	if (this.jugador.colision()){ 
		alert("sanseacabo!!");//console.log("SAN SEACABO!!!!: ("+ this.jugador.x+","+this.jugador.y+")" );
		clearInterval(this.intervalo);
		break;
	}
	this.jugador.dibujar(this.contexto);
				 var p1=document.getElementById("p1");
			 p1.innerText=this.recorrido; 
  }
}*/