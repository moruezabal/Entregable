"use strict";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let btnBorrar = document.getElementById("borrar");
let btnBorrarTodo = document.getElementById("borrarTodo");

let loadButton = document.getElementById('loadButton');

context.lineWidth = 1;//ancho de linea

let ruta = false; //si se movio el mouse

function draw(event){// funcion dibujar

    let x = event.clientX - canvas.offsetLeft; // posicion x del mouse
    let y = event.clientY - canvas.offsetTop; // posicion y del mouse

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

btnBorrarTodo.addEventListener("click", cleanUpAll);
btnBorrar.addEventListener("click", cleanUp);

loadButton.addEventListener('change', function(ev) {
    if(ev.target.files) {
       let file = ev.target.files[0];
       var reader  = new FileReader();
       reader.readAsDataURL(file);
       reader.onloadend = function (e) {
           var image = new Image();
           image.src = e.target.result;
           image.onload = function(ev) {
              var canvas = document.getElementById('canvas');
              canvas.width = image.width;
              canvas.height = image.height;
              var ctx = canvas.getContext('2d');
              ctx.drawImage(image,0,0);
          }
       }
    }
 });


function lineColour(color){ // funcion para el color
    context.strokeStyle = color.value;
}

function lineWidth(ancho){ //funcion para el ancho de la linea
    context.lineWidth = ancho.value;
    document.getElementById("value").innerHTML = ancho.value;
}

function cleanUpAll(){ // funcion borrar/limpiar todo
    context.clearRect(0,0,canvas.width, canvas.height); // se le pasa las coordenadas iniciales (0 en x y 0 en y) y el ancho y alto final del canvas
}
function cleanUp(){ 
    
    // esta funcion se usara como goma.. pinta con blanco
    console.log("Borrè");
}
