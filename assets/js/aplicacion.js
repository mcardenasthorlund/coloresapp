
class Aplicacion {

    colores = [
        'rgb(182, 53, 53)',
        'rgb(22, 121, 43)',
        'rgb(216, 42, 216)',
        'rgb(235, 129, 30)',
        'rgb(241, 229, 56)',
        'rgb(52, 52, 236)',
        'black',
        'white'
    ];

    combinacion = [];
    coloresIndicados = [];
    resultados = [];
    intento = 9;
    objetoActual = '';
    idActual = '';
    esPartidaTerminada = false;

    /**
     * Inicializa la aplicacion
     * @param {*} objeto Nombre del objeto creado para utilizarlo después
     */
    constructor(objeto) {
        this.objetoActual = objeto;
        this.inicializarEventos();

        this.inicializarJuego();
    }

    /**
     * Inicia los eventos y comienza el juego
     */
    inicializarEventos() {
        document.getElementById('btnComenzar').addEventListener('click', () => {
            document.getElementById('div-inicial').style.display = 'none';
            document.getElementById('div-combinacion').style.display = 'flex';
        });
        document.getElementById('btnJugar').addEventListener('click', () => {
            document.getElementById('div-inicial').style.display = 'none';
            document.getElementById('div-combinacion').style.display = 'none';
            document.getElementById('div-juego').style.display = 'flex';

            // Comprobamos que no haya colores repetidos y en caso que no se inicia el juego
            this.comprobarColores();

        });

        document.getElementById('btnJugarIA').addEventListener('click', () => {
            document.getElementById('div-inicial').style.display = 'none';
            document.getElementById('div-combinacion').style.display = 'none';
            document.getElementById('div-juego').style.display = 'flex';

            // Generamos una combinacion aleatoria
            let coloresAux = [...this.colores];
            const coloresMezclados = coloresAux.sort((a, b) => 0.5 - Math.random());

            console.log(this.colores);
            for (var i = 0; i < 5; i++) {
                this.combinacion.push(coloresMezclados[i]);
            }

            console.log(this.combinacion);

            // Comprobamos que no haya colores repetidos y en caso que no se inicia el juego
            this.comprobarColores();

        });

        document.getElementById('btnNuevoJuego').addEventListener('click', () => {
            document.getElementById('div-inicial').style.display = 'none';
            document.getElementById('div-combinacion').style.display = 'flex';
            document.getElementById('div-juego').style.display = 'none';

            this.inicializarJuego();
        });


    }

    /**
     * Iniciar el tablero del juego y resetear las condiciones
     */
    inicializarJuego() {
        console.log('JUEGO INICIADO');

        // Reseteamos las opciones del juego
        this.combinacion = [];
        this.coloresIndicados = [];
        this.resultados = [];
        this.intento = 9;
        this.esPartidaTerminada = false;

        for (var i = 0; i < 10; i++) {
            this.coloresIndicados.push(['', '', '', '', '']);
            this.resultados.push(['', '']);
        }

        for (var i = 0; i < 5; i++) {
            document.getElementById(i).style.backgroundColor = '';
            document.getElementById('r' + i).style.backgroundColor = '';
        }


        // Creamos el panel de selección de colores
        let divColor = document.getElementById('div-seleccion');

        divColor.innerHTML = '';
        for (let i = 0; i < this.colores.length; i++) {

            divColor.innerHTML += "<div>";
            for (let j = 0; j < 5; j++) {

                divColor.innerHTML += `<div class='circulo' style='background-color:${this.colores[i]}' 
                                            onclick="document.getElementById('${j}').style.backgroundColor = '${this.colores[i]}'"></div>`;

            }

            divColor.innerHTML += "</div>";
        }
    }

    comprobarColores() {

        if (this.combinacion.length == 0) {
            // Guardamos la combinacion elegida
            for (var i = 0; i < 5; i++) {
                if (document.getElementById(i).style.backgroundColor == '') {
                    this.mostrarMensajeModal('Debes seleccionar una color para cada círculo');

                    document.getElementById('div-inicial').style.display = 'none';
                    document.getElementById('div-combinacion').style.display = 'flex';
                    document.getElementById('div-juego').style.display = 'none';
                    this.inicializarJuego();
                    return;
                }
                this.combinacion[i] = document.getElementById(i).style.backgroundColor;
            }
        }


        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                if (this.combinacion[i] == this.combinacion[j] && i != j) {

                    this.mostrarMensajeModal('No se pueden repetir colores en la combinación');

                    console.log(i, j, this.combinacion[i], this.combinacion[j]);
                    this.inicializarJuego();

                    document.getElementById('div-inicial').style.display = 'none';
                    document.getElementById('div-combinacion').style.display = 'flex';
                    document.getElementById('div-juego').style.display = 'none';
                    return;
                }
            }
        }
        // Creamos el tablero de juego
        this.dibujarTablero();
    }


    /**
     * Sacar el toast asociado al elemento seleccionado
     * @param {*} id 
     */
    mostrarColor(id) {
        console.log(id);

        this.idActual = id;

        var toastElList = [].slice
            .call(document.querySelectorAll('.toast'));
        var toastList = toastElList.map(function (toastEl) {
            return new bootstrap.Toast(toastEl, { delay: 10000 })
        })

        toastList.forEach(toast => toast.show());

        // Le ponemos un sombreado
        document.querySelectorAll('.circulo').forEach(circulo => circulo.classList.remove('sombreado'));
        document.getElementById(id).classList.add('sombreado');
    }

    /**
     * Poner el color en el idActual
     * @param {*} color 
     */
    ponerColor(color) {
        document.getElementById(this.idActual).style.backgroundColor = this.colores[color];
        if (!this.idActual.endsWith('4'))
        {
            let indice = +this.idActual.substring(2);
            indice++;
            this.mostrarColor(this.idActual.substring(0,2) + indice);
        }
    }

    /**
     * Chequeamos la linea actual y cambiamos al siguiente intento
     */
    chequearCombinacion() {
        console.log('Chequear combinacion');

        // Comprobamos que no haya repetidos
        let coloresChequeo = [];
        for (var i = 0; i < 5; i++) {
            if (coloresChequeo.includes(document.getElementById('c' + this.intento + '' + i).style.backgroundColor)){
                this.mostrarMensajeModal('No puedes repetir color en la combinación');
                return;
            } 
            coloresChequeo[i]=document.getElementById('c' + this.intento + '' + i).style.backgroundColor;
        }

        // Guardamos los colores
        for (var i = 0; i < 5; i++) {
            this.coloresIndicados[this.intento][i] = document.getElementById('c' + this.intento + '' + i).style.backgroundColor;
        }
        // Chequeamos la combinacion
        let posicionCorrectas = 0;
        let posicionIncorrecta = 0;

        for (var i = 0; i < 5; i++) {
            if (this.coloresIndicados[this.intento][i] == this.combinacion[i]) {
                posicionCorrectas++;
            } else {

                // Comprobamos si esta pero en otra posicion
                if (this.combinacion.includes(this.coloresIndicados[this.intento][i])) {
                    posicionIncorrecta++;
                }

            }
        }

        this.resultados[this.intento] = [posicionCorrectas, posicionIncorrecta];

        console.log(this.combinacion, this.resultados, this.coloresIndicados);
        this.intento--;

        if (posicionCorrectas == 5) {
            // Hemos ganado
            let mensaje = `<img src='assets/img/victoria.png' class='img-fluid'>`;
            mensaje += "<h1>Has ganado</h1>";
            this.mostrarMensajeModal(mensaje);
            // Mostramos la combinacion
            this.revelarResultado();
        }
        if (this.intento == -1) {
            let mensaje = `<img src='assets/img/perdida.png' class='img-fluid'>`;
            mensaje += "<h1>Has perdido</h1>";
            this.mostrarMensajeModal(mensaje);

            // Revelamos el resultado
            this.revelarResultado();
        }


        this.dibujarTablero();

    }

    dibujarTablero() {
        let divColor = document.getElementById('div-circulos-juego');
        let html = '';
        for (var i = 0; i < 10; i++) {
            html += `<div class="row">
                        <div class="col-1">`;

            // Ponemos los resultados
            html += `<span class='correctas'>${this.resultados[i][0]}</span><span class='incorrectas'>${this.resultados[i][1]}</span>`;
            html += `</div>
                        <div class="col-10">
                            <div class='fila-colores' id="f${i}">`;

            for (var j = 0; j < 5; j++) {
                html += `<div class='circulo' id="c${i}${j}"`;
                if (i == this.intento && !this.esPartidaTerminada) {
                    html += ` onclick="${this.objetoActual}.mostrarColor('c${i}${j}')"`;
                }
                html += ` style='background-color:${this.coloresIndicados[i][j]}'`;
                html += `></div>`;
            }

            html += `<span class='numero-intento'>#${10 - i}</span>`;
            html += `</div></div>
                        <div class="col-1">`;

            if (i == this.intento && !this.esPartidaTerminada) {
                html += `<div class="div-icono-fila" onclick="${this.objetoActual}.chequearCombinacion()"}>
                            <span class="icono-fila"><i class="bi bi-chevron-right"></i></span>
                        </div>`;
            }
            html += `</div></div>`;
        }

        divColor.innerHTML = html;
    }

    revelarResultado() {

        this.esPartidaTerminada = true;
        for (var i = 0; i < 5; i++) {
            document.getElementById('r' + i).style.backgroundColor = this.combinacion[i];
        }
    }

    mostrarMensajeModal(mensaje) {

        document.getElementById('modal-mensaje').innerHTML = mensaje;
        const miModal = new bootstrap.Modal(document.getElementById('mdlMensaje'));
        miModal.show();
    }
}