"use strict";

let canvas = document.getElementById("canvas");
let contexto = document.getElementById("2d");

contexto.lineWhidth = 1;//ancho de linea

let ruta = flse; //???

function draw(event){// funcion dibujar

    x= event.clientX; // posicion x del mouse
    y = event.clientY; // posicion y del mouse

    if(ruta == true){
        contexto.lineTo(x,y); // hacer linea al x,y
        contexto.stroke(); // dibuja la linea
    }
}

canvas.addEventListener('mousemove', draw); // cuando el mouse se mueve

canvas.addEventListener('mousedown', function(){ // cuando tenemos presionado el mouse
    ruta = true;
    contexto.beginPath(); // para comenzar a dibujar
    contexto.moveTo(x,y) // primeras coordenadas para empezar a dibujar, donde hace click el mouse
    canvas.addEventListener('mousemove', draw);// llama a la funcion dibujar
});

canvas.addEventListener('mouseup', function(){ //cuando levanto el mouse se activa esta funcion
    ruta = false; 
});


