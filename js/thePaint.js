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
let btnSave = document.getElementById("save");

let loadButton = document.getElementById('loadButton');

//--------------------------

context.lineWidth = 1;//Ancho de línea
context.contrast = 0;// Inicio de contraste

let ruta = false; //Si se movió el mouse

// Función dibujar
function draw(event){
    let x = event.clientX - canvas.offsetLeft; // Posición x del mouse
    let y = event.clientY - canvas.offsetTop; // Posición y del mouse

    if(ruta == true){
        context.lineTo(x,y); // Hacer línea al x,y
        context.stroke(); // Dibuja la línea
    }
}

function scaleToFit(img){
    let canvas = document.getElementById("canvas");
    // Obtener la escala
    let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // Obtener la posición superior izquierda de la imagen
    let x = (canvas.width / 2) - (img.width / 2) * scale;
    let y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
}

function lineColour(color){ // Función para el color
    context.strokeStyle = color.value;
}

function lineWidth(ancho){ //Función para el ancho de la linea
    context.lineWidth = ancho.value;
    document.getElementById("value").innerHTML = ancho.value;
}

function cleanUpAll(){ // Función borrar/limpiar todo
    context.clearRect(0,0,canvas.width, canvas.height); // se le pasa las coordenadas iniciales (0 en x y 0 en y) y el ancho y alto final del canvas
}
function cleanUp(){  // Borra/dibuja en blanco
    context.strokeStyle = 'white'; // se setea el color blanco para borrar/dibujar
}

function contrast(grado){ //Función para determinar el grado de contraste
    context.contrast = grado.value;
    document.getElementById("degree").innerHTML = grado.value;
}

// Función guardar imagen
function saveImage() { 
    let link = window.document.createElement( 'a' );
    let url = canvas.toDataURL();
    let filename = 'image.jpg';
 
    link.setAttribute( 'href', url );
    link.setAttribute( 'download', filename );
    link.style.visibility = 'hidden';
    window.document.body.appendChild( link );
    link.click();
    window.document.body.removeChild( link );
};

// -----------------------FILTROS------------------------------------

// Filtro Escala de Grises
function grayScaleImage() { 
    let imageData = context.getImageData(0,0,canvas.width, canvas.height);
    let pixels = imageData.data;
    let numPixels = pixels.length;
  
    context.clearRect(0, 0,canvas.width, canvas.height);
    //iteracion por pixel y sus valores
    for (let i = 0; i < numPixels; i++) {
        let prom = (pixels[i*4] + pixels[i*4+1] + pixels[i*4+2]) /3;
        
        pixels[i*4] = prom;
        pixels[i*4+1] = prom;
        pixels[i*4+2] = prom;
    }
    context.putImageData(imageData, 0, 0);
}

// Filtro Negativo
function negativeImage(){ 
    let imageData = context.getImageData(0,0,canvas.width, canvas.height);
    let pixels = imageData.data;

    for(let i = 0; i < pixels.length; i += 4){
        let r = pixels[i]; 
        let g = pixels[i + 1]; 
        let b = pixels[i + 2]; 
        let a = pixels[i + 3]; 

        let invertedRed = 255 - r;
        let invertedGreen = 255 - g;
        let invertedBlue = 255 - b;

        pixels[i] = invertedRed;
        pixels[i + 1] = invertedGreen;
        pixels[i + 2] = invertedBlue;
    }
    context.putImageData(imageData, 0, 0);
}

// Filtro Sepia
function sepiaImage() { 
    let imageData = context.getImageData(0,0,canvas.width, canvas.height);
    let pixels = imageData.data;
    let numPixels = pixels.length;
 
    for ( let i = 0; i < numPixels; i++ ) {
        let r = pixels[ i * 4 ];
        let g = pixels[ i * 4 + 1 ];
        let b = pixels[ i * 4 + 2 ];
 
        pixels[ i * 4 ] = 255 - r;
        pixels[ i * 4 + 1 ] = 255 - g;
        pixels[ i * 4 + 2 ] = 255 - b;
 
        pixels[ i * 4 ] = ( r * .393 ) + ( g *.769 ) + ( b * .189 );
        pixels[ i * 4 + 1 ] = ( r * .349 ) + ( g *.686 ) + ( b * .168 );
        pixels[ i * 4 + 2 ] = ( r * .272 ) + ( g *.534 ) + ( b * .131 );
    }
    context.putImageData( imageData, 0, 0 );
}

//Filtro de contraste
function contrastImage(){
    let imageData = context.getImageData(0,0,canvas.width, canvas.height);
    let pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        let contrast = document.getElementById("degree").innerHTML;
        let average = Math.round( ( pixels[i] + pixels[i+1] + pixels[i+2] ) / 3 );
        if (average > 127){
            pixels[i] += ( pixels[i]/average ) * contrast;
            pixels[i+1] += ( pixels[i+1]/average ) * contrast;
            pixels[i+2] += ( pixels[i+2]/average ) * contrast;
        }else{
            pixels[i] -= ( pixels[i]/average ) * contrast;
            pixels[i+1] -= ( pixels[i+1]/average ) * contrast;
            pixels[i+2] -= ( pixels[i+2]/average ) * contrast;
        }
    }
    context.putImageData( imageData, 0, 0 );
}

function blurImage() {




    
    //Apply blur effect
}

//--------------------------------------

// Cuando el mouse se mueve
canvas.addEventListener('mousemove', draw); 

// Cuando tenemos presionado el mouse
canvas.addEventListener('mousedown', function(){ 
    ruta = true;
    context.beginPath(); // Para comenzar a dibujar
    context.moveTo(x,y); // Primeras coordenadas para empezar a dibujar, donde hace click el mouse
    canvas.addEventListener('mousemove', draw);// Llama a la función dibujar
});

// Cuando levanto el mouse se activa esta funcion
canvas.addEventListener('mouseup', function(){ 
    ruta = false; 
});

loadButton.addEventListener('change', function(ev) {
    cleanUpAll();
    if(ev.target.files) {
        let file = ev.target.files[0];
        let reader  = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            let image = new Image();
            image.src = e.target.result;
            image.onload = function(ev) { //El evento se activa cada vez q la operacion de lectura se completo satisfactoriamente
                scaleToFit(this);
            }
        }
    }
});

btnBorrarTodo.addEventListener("click", cleanUpAll);
btnBorrar.addEventListener("click", cleanUp);

btnGreyScale.addEventListener("click", grayScaleImage);
btnNegative.addEventListener("click", negativeImage);
btnSepia.addEventListener("click", sepiaImage);
btnContrast.addEventListener("click", contrastImage);
btnBlur.addEventListener("click", blurImage);
btnSave.addEventListener("click", saveImage);
