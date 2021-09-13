"use strict";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

context.lineWidth = 1;//ancho de linea

let ruta = false; //si se movio el mouse

function draw(event){// funcion dibujar

    let x = event.clientX; // posicion x del mouse
    let y = event.clientY; // posicion y del mouse

    if(ruta == true){
        context.lineTo(x,y); // hacer linea al x,y
        context.stroke(); // dibuja la linea
    }
}

canvas.addEventListener('mousemove', draw); // cuando el mouse se mueve

canvas.addEventListener('mousedown', function(){ // cuando tenemos presionado el mouse
    ruta = true;
    context.beginPath(); // para comenzar a dibujar
    context.moveTo(x,y) // primeras coordenadas para empezar a dibujar, donde hace click el mouse
    canvas.addEventListener('mousemove', draw);// llama a la funcion dibujar
});

canvas.addEventListener('mouseup', function(){ //cuando levanto el mouse se activa esta funcion
    ruta = false; 
});

function lineColour(color){ // funcion para el color
    context.strokeStyle = color.value;
}

function lineWidth(ancho){ //funcion para el ancho de la linea
    context.lineWidth = ancho.value;
    document.getElementById("value").innerHTML = ancho.value;
}

function cleanUp(){ // funcion borrar/limpiar
    context.cleanReact(0,0,canvas.width, canvas.height); // se le pasa las coordenadas iniciales (0 en x y 0 en y) y el ancho y alto final del canvas
}
