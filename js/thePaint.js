"use strict";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let btnBorrar = document.getElementById("borrar");
let btnBorrarTodo = document.getElementById("borrarTodo");
let btnGreyScale = document.getElementById("greyScale");
let btnNegative = document.getElementById("negative");
let btnSepia = document.getElementById("sepia");
let btnContrast = document.getElementById("contrast");
let btnBlur = document.getElementById("blur");

let loadButton = document.getElementById('loadButton');

context.lineWidth = 1;//ancho de linea
context.contrast = 0;// inicio de contr

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




loadButton.addEventListener('change', function(ev) {
    cleanUpAll();
    if(ev.target.files) {
        let file = ev.target.files[0];
        var reader  = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function(ev) { //El evento se activa cada vez q la operacion de lectura se completo satisfactoriamente
                scaleToFit(this);
            }
        }
    }
});

function scaleToFit(img){
    let canvas = document.getElementById("canvas");
    // obtener la escala
    var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // obtener la posición superior izquierda de la imagen
    var x = (canvas.width / 2) - (img.width / 2) * scale;
    var y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
}


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

function contrast(grado){ //funcion para el ancho de la linea
    context.lineWidth = grado.value;
    document.getElementById("degree").innerHTML = grado.value;
}

// -----------------------EFECTOS------------------------------------
function grayscale() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
  
    var imageData = context.getImageData(0,0,canvas.width, canvas.height);
    var pixels = imageData.data;
    var numPixels = pixels.length;
  
    context.clearRect(0, 0,canvas.width, canvas.height);
    //iteracion por pixel y sus valores
    for (var i = 0; i < numPixels; i++) {
        var prom = (pixels[i*4] + pixels[i*4+1] + pixels[i*4+2]) /3;
        
        pixels[i*4] = prom;
        pixels[i*4+1] = prom;
        pixels[i*4+2] = prom;
    }
    context.putImageData(imageData, 0, 0);
}

function negative(){
    var imageData = context.getImageData(0,0,canvas.width, canvas.height);
    var dataArr = imageData.data;

    for(var i = 0; i < dataArr.length; i += 4)
    {
        var r = dataArr[i]; 
        var g = dataArr[i + 1]; 
        var b = dataArr[i + 2]; 
        var a = dataArr[i + 3]; 

        var invertedRed = 255 - r;
        var invertedGreen = 255 - g;
        var invertedBlue = 255 - b;

        dataArr[i] = invertedRed;
        dataArr[i + 1] = invertedGreen;
        dataArr[i + 2] = invertedBlue;
    }
    context.putImageData(imageData, 0, 0);
}

function sepia() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
  
    var imageData = context.getImageData(0,0,canvas.width, canvas.height);
    var pixels = imageData.data;
    var numPixels = pixels.length;
 
    for ( var i = 0; i < numPixels; i++ ) {
        var r = pixels[ i * 4 ];
        var g = pixels[ i * 4 + 1 ];
        var b = pixels[ i * 4 + 2 ];
 
        pixels[ i * 4 ] = 255 - r;
        pixels[ i * 4 + 1 ] = 255 - g;
        pixels[ i * 4 + 2 ] = 255 - b;
 
        pixels[ i * 4 ] = ( r * .393 ) + ( g *.769 ) + ( b * .189 );
        pixels[ i * 4 + 1 ] = ( r * .349 ) + ( g *.686 ) + ( b * .168 );
        pixels[ i * 4 + 2 ] = ( r * .272 ) + ( g *.534 ) + ( b * .131 );
    }
 
    context.putImageData( imageData, 0, 0 );
}

function contrastImage(){

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
  
    var imageData = context.getImageData(0,0,canvas.width, canvas.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var contrast = document.getElementById("degree").innerHTML;
        var average = Math.round( ( data[i] + data[i+1] + data[i+2] ) / 3 );
        if (average > 127){
            data[i] += ( data[i]/average ) * contrast;
            data[i+1] += ( data[i+1]/average ) * contrast;
            data[i+2] += ( data[i+2]/average ) * contrast;
        }else{
            data[i] -= ( data[i]/average ) * contrast;
            data[i+1] -= ( data[i+1]/average ) * contrast;
            data[i+2] -= ( data[i+2]/average ) * contrast;
        }
    }
    context.putImageData( imageData, 0, 0 );
}

function blur() {
    //Apply blur effect
}


btnBorrarTodo.addEventListener("click", cleanUpAll);
btnBorrar.addEventListener("click", cleanUp);

btnGreyScale.addEventListener("click", grayscale);
btnNegative.addEventListener("click", negative);
btnSepia.addEventListener("click", sepia);
btnContrast.addEventListener("click", contrastImage);
btnBlur.addEventListener("click", blur)