"use strict";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let btnBorrar = document.getElementById("borrar");
let btnNuevo = document.getElementById("nuevo");
let btnGreyScale = document.getElementById("greyScale");
let btnNegative = document.getElementById("negative");
let btnSepia = document.getElementById("sepia");
let btnContrast = document.getElementById("contrast");
let btnBlur = document.getElementById("blur");
let btnSave = document.getElementById("save");
let btnEdgeDetection = document.getElementById("edgeDetection");

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

//Función para que al subir la imagen se adapte al lienzo
function scaleToFit(img){
    let canvas = document.getElementById("canvas");
    // Obtener la escala
    let scale = Math.min(canvas.width / img.width, canvas.height / img.height); // toma la menor proporcion
    // Obtener la posición superior izquierda de la imagen
    let x = (canvas.width / 2) - (img.width / 2) * scale;
    let y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
}

function lineColour(color){ // Función para el color del "lapiz"
    context.strokeStyle = color.value; // toma el color del picker
}

function lineWidth(ancho){ //Función para el ancho de la linea
    context.lineWidth = ancho.value; // toma el ancho seleccionado por el usuario
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
    let link = window.document.createElement( 'a' ); // se crea el enlace
    let url = canvas.toDataURL(); // se extrae la direccion URL del canvas
    let filename = 'image.jpg'; // nombre del archivo de como se va a guardar
 
    link.setAttribute( 'href', url ); // se setea el atributo href del enlace
    link.setAttribute( 'download', filename ); // se setea el atributo de descargacon el nombre del archivo nuevo
    link.style.visibility = 'hidden'; // se esconde el enlace para que no se vea
    window.document.body.appendChild( link ); // inserta el enlace en la pag
    link.click(); // se autogenera un click que es el que abre la ventana de descarga
    window.document.body.removeChild( link ); // se remueve el enlace de la pag
};

// -----------------------FILTROS------------------------------------

// Filtro Escala de Grises
function grayScaleImage() { 
    let imageData = context.getImageData(0,0,canvas.width, canvas.height);
    let pixels = imageData.data;
  
    context.clearRect(0, 0,canvas.width, canvas.height);// limpia el lienzo
    //Iteracion por pixel y sus valores
    for (let i = 0; i < pixels.length; i++) {
        let prom = (pixels[i*4] + pixels[i*4+1] + pixels[i*4+2]) /3; // busca un promedio para ubicarlo en la escala de grises.
        
        pixels[i*4] = prom;
        pixels[i*4+1] = prom;
        pixels[i*4+2] = prom;
    }
    // Coloca los datos de la imagen en el lienzo
    context.putImageData(imageData, 0, 0); 
}

// Filtro Negativo
function negativeImage(){ 
    let imageData = context.getImageData(0,0,canvas.width, canvas.height);
    let pixels = imageData.data;
    // Invierte los valores de los colores en el pixel
    for(let i = 0; i < pixels.length; i += 4){
        let r = pixels[i]; 
        let g = pixels[i + 1]; 
        let b = pixels[i + 2]; 

        let invertedRed = 255 - r;
        let invertedGreen = 255 - g;
        let invertedBlue = 255 - b;

        pixels[i] = invertedRed;
        pixels[i + 1] = invertedGreen;
        pixels[i + 2] = invertedBlue;
    }
    // Coloca los datos de la imagen en el lienzo
    context.putImageData(imageData, 0, 0);
}

// Filtro Sepia
function sepiaImage() { 
    let imageData = context.getImageData(0,0,canvas.width, canvas.height);
    let pixels = imageData.data;
 
    for ( let i = 0; i < pixels.length; i++ ) {
        let r = pixels[i * 4];
        let g = pixels[i * 4 + 1];
        let b = pixels[i * 4 + 2];
 
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
 
        r = ( r * .393 ) + ( g *.769 ) + ( b * .189 );
        g = ( r * .349 ) + ( g *.686 ) + ( b * .168 );
        b = ( r * .272 ) + ( g *.534 ) + ( b * .131 );
    }
    // Coloca los datos de la imagen en el lienzo
    context.putImageData( imageData, 0, 0 );
}

//Filtro de contraste
function contrastImage(){
    let imageData = context.getImageData(0,0,canvas.width, canvas.height);
    let pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        let contrast = document.getElementById("degree").innerHTML; // trae el dato de saturación señalado por el usuario y lo guarda en contrast
        let prom = Math.round( ( pixels[i] + pixels[i+1] + pixels[i+2] ) / 3 ); // pone en la variable prom un numero redondo mas cercano al resultado
        if (prom > 127){
            pixels[i] += ( pixels[i]/prom ) * contrast;
            pixels[i+1] += ( pixels[i+1]/prom ) * contrast;
            pixels[i+2] += ( pixels[i+2]/prom ) * contrast;
        }else{
            pixels[i] -= ( pixels[i]/prom ) * contrast;
            pixels[i + 1] -= ( pixels[i + 1]/prom ) * contrast;
            pixels[i + 2] -= ( pixels[i + 2]/prom ) * contrast;
        }
    }
    // Coloca los datos de la imagen en el lienzo
    context.putImageData( imageData, 0, 0 ); 
}


function copyImageData(context, src){ // retorna una imagen con los datos de la imagen pasada por parametro
    var dst = context.createImageData(src.width, src.height);
    dst.data.set(src.data);
    return dst;
}

// Filtro de desenfoque o Blur
function blurImage() {
    let canvasData = context.getImageData(0, 0, canvas.width, canvas.height);
   
    let copyCanvasData = copyImageData(context, canvasData);
    let sumred = 0;
    let sumgreen = 0;
    let sumblue = 0;

    // Recorro la matriz
    for ( let x = 0; x < copyCanvasData.width; x++) {    
        for ( let y = 0; y < copyCanvasData.height; y++) {    

            // Índice del píxel en la matriz    
            let index = (x + y * copyCanvasData.width) * 4;       
            for(let subCol=-2; subCol<=2; subCol++) {
                let col = subCol + x;
                if(col <0 || col >= copyCanvasData.width) {
                    col = 0; // si se va del rango de la matriz col se vuelve cero para que se mantenga dentro de la misma
                }
                for(let subfil=-2; subfil<=2; subfil++) {
                    let fil = subfil + y;
                    if(fil < 0 || fil >= copyCanvasData.height) {
                        fil = 0; // Lo mismo que las columnas pero ahora con las filas
                    }
                    
                    let index2 = (col + fil * copyCanvasData.width) * 4;    
                    let r = copyCanvasData.data[index2 + 0];    
                    let g = copyCanvasData.data[index2 + 1];    
                    let b = copyCanvasData.data[index2 + 2];
                    sumred += r;
                    sumgreen += g;
                    sumblue += b;
                }
            }
            // Calculamos el nuevo valor del RGB
            let newRed = (sumred / 25.0);
            let newGreen = (sumgreen / 25.0);
            let newBlue = (sumblue / 25.0);
            
            // Seteamos en cero para el proximo pixel
            sumred = 0;
            sumgreen = 0;
            sumblue = 0;
            // se asigna un nuevo pixel
            canvasData.data[index + 0] = newRed;   
            canvasData.data[index + 1] = newGreen; 
            canvasData.data[index + 2] = newBlue;
        }
    }
    // Coloca los datos de la imagen en el lienzo
    context.putImageData(canvasData, 0, 0);
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


// Funcion de carga el canvas con una imagen ingresada por archivo
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

function conv3x(data, idx, w, m){ // Calcula el valor de convolucion segun el kernel de 3x3 en x
    return (m[0]*data[idx - w - 4] + m[1]*data[idx - 4] + m[2]*data[idx + w - 4]
            -m[0]*data[idx - w + 4] - m[1]*data[idx + 4] - m[2]*data[idx + 4 + 4]);
  }
  
  function conv3y(data, idx, w, m){// Calcula el valor de convolucion segun el kernel de 3x3 en y
    return (m[0]*data[idx - w - 4] + m[1]*data[idx - w] + m[2]*data[idx - w + 4]
        -(m[0]*data[idx + w - 4] + m[1]*data[idx + w] + m[2]*data[idx + w + 4]));
  }
  
  function gradient_internal(pixels, mask){ //Funcion encargada de transformar los pixeles
    var data = pixels.data;
    var w = pixels.width*4;
    var l = data.length - w - 4;
    var buff = new data.constructor(new ArrayBuffer(data.length)); // Genera un array buffer con los datos de la imagen para un procesamiento mas optimo
    
    for (var i = w + 4; i < l; i+=4){
      var dx = conv3x(data, i, w, mask);
      var dy = conv3y(data, i, w, mask);
      buff[i] = buff[i + 1] = buff[i + 2] = Math.sqrt(dx*dx + dy*dy);
      buff[i + 3] = 255;
    }
    pixels.data.set(buff);
  }
    
  function gradient(){ // Funcion que genera el filtro de deteccion de bordes
    var pixels = context.getImageData(0, 0, canvas.width,canvas.height);
    gradient_internal(pixels, [1, 2, 1]); // El segundo parametro es el patron del filtro Sobel
    context.putImageData(pixels, 0, 0);
  }

btnNuevo.addEventListener("click", cleanUpAll);
btnBorrar.addEventListener("click", cleanUp);

btnGreyScale.addEventListener("click", grayScaleImage);
btnNegative.addEventListener("click", negativeImage);
btnSepia.addEventListener("click", sepiaImage);
btnContrast.addEventListener("click", contrastImage);
btnBlur.addEventListener("click", blurImage);
btnSave.addEventListener("click", saveImage);
btnEdgeDetection.addEventListener("click", gradient);


