"use strict";

let juego;
const puntosGanar = 4;
let puntos;
let puntuacion;
let intentos;
let tiempo;
let leaderboard;
let cartasSeleccionadas;
let cartasGiradas;
let elemIntentos;
let elemTiempo;
let elemResultado;
let elemResultadoPerdido;
let elemPuntuacion;
let elemStartScreen;
let elemEndingScreen;
let elemLeaderboard;
let elemCartas;
let elemNombreLB;

function iniciarJuego() {
    
    elemIntentos = document.getElementById("intentos");
    elemTiempo = document.getElementById("tiempo");
    elemResultado = document.getElementById("resultado");
    elemResultadoPerdido = document.getElementById("resultadoPerdido");
    elemPuntuacion = document.getElementById("puntuacion");
    elemStartScreen = document.getElementById("startScreen");
    elemEndingScreen = document.getElementById("endingScreen");
    elemLeaderboard = document.getElementById("leaderboard");
    elemCartas = document.getElementById("divCartas");

    juego = true;

    puntos = 0;
    puntuacion = 0;
    intentos = 5;
    cartasSeleccionadas = 0;
    cartasGiradas = 0;
    tiempo = new cuentaAtras(elemTiempo, 30);

    elemIntentos.innerHTML = intentos;
    elemTiempo.innerHTML = tiempo;
    elemResultado.innerHTML = "";

    while (elemCartas.firstChild) {
        elemCartas.removeChild(elemCartas.firstChild);
    }
    
    while (elemLeaderboard.firstChild) {
        elemLeaderboard.removeChild(elemLeaderboard.firstChild);
    }

    if (!elemStartScreen.hidden) {
        elemStartScreen.hidden = true;
    }

    if (!elemEndingScreen.hidden) {
        elemEndingScreen.hidden = true;
    }
    
    leerLeaderboard();
    printaJuego();
}

/*
*   @param 'resultado' puede ser: 
*   0 - derrota
*   1 - victoria
*
*   @param 'motivo' puede ser: 
*   'intentos' - Se han agotado los intentos
*   'tiempo' - Se ha agotado el tiempo
*/
function finalizarJuego(resultado, motivo) {
    juego = false;
    let puntuacionTiempo = tiempo.stop();
    elemEndingScreen.hidden = false;
    puntuacion = intentos * puntuacionTiempo;

    if (puntuacion < 0) {
        puntuacion = 0;
    }
    
    elemPuntuacion.innerHTML = puntuacion;
    
    cargaLeaderboard(puntuacion);

    if (resultado) {
        elemResultado.innerHTML = "HAS GANADO!";
    } else {
        elemResultado.innerHTML = "HAS PERDIDO!";

        if (motivo=='intentos') {
            elemResultadoPerdido.innerHTML = " Has agotado todos los intentos.";
        } else if (motivo=='tiempo') {
            elemResultadoPerdido.innerHTML = " Se ha agotado el tiempo.";
        }
    }
}

/*
*   Suma puntos según si el jugador ha acertado
*   @param 'jugada' puede ser:
*   1 - acierto
*   0 - fallo
*/
function resultadoJugada(jugada) {

    if (jugada == 1) {
        puntos++;

        if (puntos >= puntosGanar) {
            finalizarJuego(1);
        }
    }
    else if (jugada == 0) {
        intentos--;
        elemIntentos.innerHTML = intentos;

        if (intentos == 0) {
            finalizarJuego(0, 'intentos');
        }
    }
}

function printaJuego() {
    
    tiempo.start();
    let arrayCartas = new Array(puntosGanar*2);

    let j = 0;
    for (let i = 0; i < arrayCartas.length; i++) {
        if (i%2==0) {
            arrayCartas[i] = "<div class='col-3 col-sm-1 carta-container'>"
                                +"<div class='carta off' id='a" + j + "' onclick='compara(a" + j + ")'>"
                                    +"<div class='front'>"
                                        +"<img class='img-fluid' src='imgs/" + j + ".png'>"
                                    +"</div>"
                                    +"<div class='back'>"
                                        +"<img class='img-fluid' src='imgs/detras.png'>"
                                    +"</div>"
                                +"</div>"
                            +"</div>";
        } else {
            arrayCartas[i] = "<div class='col-3 col-sm-1 carta-container'>"
                                +"<div class='carta off' id='b" + j + "' onclick='compara(b" + j + ")'>"
                                    +"<div class='front'>"
                                        +"<img class='img-fluid' src='imgs/" + j + ".png'>"
                                    +"</div>"
                                    +"<div class='back'>"
                                        +"<img class='img-fluid' src='imgs/detras.png'>"
                                    +"</div>"
                                +"</div>"
                            +"</div>";
            j++;
        }
    }

    mezcla(arrayCartas);

    for (let i = 0; i < arrayCartas.length; i++) {
        elemCartas.innerHTML += arrayCartas[i];
    }
}

function mezcla(arrayCartas) {
    let arr;
    let currentIndex = arrayCartas.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        arr = [
            arrayCartas[randomIndex], arrayCartas[currentIndex]
        ], arrayCartas[currentIndex] = arr[0], arrayCartas[randomIndex] = arr[1];
    }
    return arrayCartas;
}

let elemCarta1;
let elemCarta2;

function compara(carta) {
    if (juego) {
        cartasGiradas++;

        if (cartasGiradas <= 2) {

            if (elemCarta1==undefined) {
                elemCarta1 = carta;
            }                        

            if (cartasSeleccionadas == 0) {
                girarCarta(elemCarta1);
                localStorage.setItem("idCarta", carta.id);  

            } else if (cartasSeleccionadas == 1) {
                
                if (elemCarta2==undefined) {
                    elemCarta2 = carta;
                }

                let idCarta1 = localStorage.getItem("idCarta");
                let idCarta2 = carta.id;

                if (idCarta1 != idCarta2) { // Que la misma imagen no pueda ser seleccionada dos veces
                    girarCarta(elemCarta2);

                    if (idCarta1.slice(1)==idCarta2.slice(1)) {
                        cartasGiradas = 0;
                        elemCarta1.removeAttribute("onclick");
                        elemCarta2.removeAttribute("onclick");
                        elemCarta1=undefined;
                        elemCarta2=undefined;
                        resultadoJugada(1);
                    } else {
                        setTimeout(function () {
                            girarCarta(elemCarta1);
                            girarCarta(elemCarta2);
                            cartasGiradas = 0;
                            elemCarta1=undefined;
                            elemCarta2=undefined;
                        }, 500);
                        resultadoJugada(0);
                    }
                } else {
                    setTimeout(function () {
                        localStorage.removeItem("idCarta");
                        girarCarta(elemCarta1);
                        cartasGiradas = 0;
                        elemCarta1=undefined;
                        elemCarta2=undefined;
                    }, 500);
                    resultadoJugada(0);
                }
            }

            if (cartasSeleccionadas == 1) {
                cartasSeleccionadas = 0;
            } else {
                cartasSeleccionadas++;
            }
        }
    }
}


function girarCarta(carta) {

    if (carta.classList.contains('on')) {
        carta.classList.remove('on');
        carta.classList.add('off');
    } else {
        carta.classList.remove('off');
        carta.classList.add('on');
    }
}

function cuentaAtras(elem, segundos) {
    let that = {};
    let tiempoRestante;

    that.elem = elem;
    that.segundos = segundos;
    that.tiempoTotal = segundos * 100;
    that.tiempoUsado = 0;
    that.tiempoInicial = +new Date();
    that.timer = null;

    that.count = function() {
        that.tiempoUsado = Math.floor((+new Date() - that.tiempoInicial) / 10);

        tiempoRestante = that.tiempoTotal - that.tiempoUsado;
        if (tiempoRestante <= 0) {
            that.elem.innerHTML = '00.00';
            finalizarJuego(0, 'tiempo');
            clearInterval(that.timer);
        } else {
            let ss = Math.floor(tiempoRestante / 100);
            let ms = tiempoRestante - Math.floor(tiempoRestante / 100) * 100;

            that.elem.innerHTML = that.fillZero(ss) + "." + that.fillZero(ms);
        }
    };
  
    that.init = function() {
        if(that.timer){
            clearInterval(that.timer);
            that.elem.innerHTML = '00.00';
            that.tiempoTotal = segundos * 100;
            that.tiempoUsado = 0;
            that.tiempoInicial = +new Date();
            that.timer = null;
        }
    };

    that.start = function() {
        if(!that.timer){
            that.timer = setInterval(that.count, 1);
        }
    };

    that.stop = function() {
        if (that.timer) {
            clearInterval(that.timer);
            return tiempoRestante;
        }   
    };

    that.fillZero = function(num) {
        return num < 10 ? '0' + num : num;
    };

    return that;
}

function leerLeaderboard() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            let doc = this.responseText;
            leaderboard = JSON.parse(JSON.parse(doc));
            cargaLeaderboard(0);
        }
    };
    xhttp.open("GET", "./leaderboard.json", true);
    xhttp.send();
}

function cargaLeaderboard(puntuacion) {
    
    let indiceLB=null;
    
    elemLeaderboard.innerHTML = "";
    
    if (puntuacion >= leaderboard[0].puntuacion) {
        leaderboard[2].nombre=leaderboard[1].nombre;
        leaderboard[2].puntuacion=leaderboard[1].puntuacion;
        leaderboard[1].nombre=leaderboard[0].nombre;
        leaderboard[1].puntuacion=leaderboard[0].puntuacion;
        
        leaderboard[0].nombre="<input type='text' id='nombreLeaderboard' name='name' placeholder='Escribe tu nombre'>";
        leaderboard[0].puntuacion=puntuacion;
        indiceLB=0;
    } else if (puntuacion >= leaderboard[1].puntuacion) {
        leaderboard[2].nombre=leaderboard[1].nombre;
        leaderboard[2].puntuacion=leaderboard[1].puntuacion;
        
        leaderboard[1].nombre="<input type='text' id='nombreLeaderboard' name='name' placeholder='Escribe tu nombre'>";
        leaderboard[1].puntuacion=puntuacion;
        
        indiceLB=1;
    } else if (puntuacion >= leaderboard[2].puntuacion) {
        
        leaderboard[2].nombre="<input type='text' id='nombreLeaderboard' name='name' placeholder='Escribe tu nombre'>";
        leaderboard[2].puntuacion=puntuacion;
        
        indiceLB=2;
    }
    
    for (let i = 0; i < leaderboard.length; i++){
        let obj = leaderboard[i];
        
        for (let key in obj){
            let value = obj[key];
            elemLeaderboard.innerHTML += "<p>" + value + "</p>";
        }
    }
    
    if (indiceLB != null) {
        elemNombreLB = document.getElementById("nombreLeaderboard");
        elemNombreLB.value = "";
    
        elemNombreLB.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                if (elemNombreLB.value != "") {
                    leaderboard[indiceLB].nombre=elemNombreLB.value;
                    elemNombreLB.outerHTML = elemNombreLB.value;
                } else  {
                    leaderboard[indiceLB].nombre="Anónimo";
                    elemNombreLB.outerHTML = "Anónimo";
                }
                escribirLeaderboard();
            }
        }); 
    }
}

function escribirLeaderboard() {
    console.log("Escribiendo...");
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", "./php/writeLeaderboard.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("leaderboard=" + JSON.stringify(leaderboard));
}