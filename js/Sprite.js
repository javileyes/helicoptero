function Sprite(img){
    this.img=img;
    this.movimientos=[];
}

//se ponen a mano todos los sprites en esa dirección:(iz-arr, ab-der) por cada sprite
//ejem uso: objSprite.setmovimiento("salto",[[12,233,42,287],[64,233,94,287],[116,233,145,287],[166,233,196,287],[217,233,247,287],[270,233,300,287],[321,233,350,287],[374,233,404,287]]);
//ejem uso: objSprite.setmovimiento("arriba",[[12,233,42,287],[64,233,94,287],[116,233,145,287],[166,233,196,287],[217,233,247,287],[270,233,300,287],[321,233,350,287],[374,233,404,287]]);

Sprite.prototype.setMovimientos=function(movimiento,coordenadas){  
    this.movimientos[movimiento]=coordenadas;
}

//si sprites están normalizados utilizamos esta
//ejem uso: .createmovimiento(4,8,15,2,11,7,{"salto":3,"arriba":0});  //la tira de sprites del salto esta en la cuarta fila
Sprite.prototype.createMovimiento=function(filas, columnas, ajustear,ajusteab,ajusteiz,ajustede,movimientos){ 
    var ancho=this.img.width/columnas;
    var alto=this.img.height/filas;
    
    for (movimiento in movimientos)
    {
        this.movimientos[movimiento]=[];
        for (var i=0;i<columnas;i++)
        {
            this.movimientos[movimiento].push([i*ancho+ajusteiz,movimientos[movimiento]*alto+ajustear,(i+1)*ancho-ajustede,(movimientos[movimiento]+1)*alto-ajusteab]);
        }
    }
}
Sprite.prototype.getNumSprites=function(movimiento){
    return this.movimientos[movimiento].length;
}
Sprite.prototype.dibujar=function(contexto,ancho,alto,movimiento,indice){
    contexto.drawImage(this.img, this.movimientos[movimiento][indice][0],
                                this.movimientos[movimiento][indice][1], 
                                this.movimientos[movimiento][indice][2]-this.movimientos[movimiento][indice][0], //ancho= X del vertice arr-izq - X de vertice aba-derecho
                                this.movimientos[movimiento][indice][3]-this.movimientos[movimiento][indice][1],
                                -ancho/2, -alto/2, ancho, alto);  //para que el centro de la imagen sea el eje de coordenadas del contexto
}// JavaScript Document