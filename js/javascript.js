// JavaScript para cargar noticias desde un archivo JSON
function cargarNoticias(
    idioma = "es"
){

    fetch(
        "/assets/json/noticias.json"
    )

    .then(response => {

        if(!response.ok){

            throw new Error(
                "No se pudo cargar noticias.json"
            );
        }

        return response.json();

    })

    .then(noticias => {

        const container =
        document.getElementById(
            "news-container"
        );

        container.innerHTML =
        "";

        noticias.forEach(
            noticia => {

                const article =
                document.createElement(
                    "article"
                );

                article.classList.add(
                    "news-card"
                );

                article.innerHTML = `
                    <h4>
                        ${noticia[idioma].titulo}
                    </h4>

                    <p>
                        ${noticia[idioma].descripcion}
                    </p>
                `;

                container.appendChild(
                    article
                );

            }
        );

    })

    .catch(error => {

        console.error(
            error
        );

    });

}

// JavaScript para cargar el mapa con Leaflet

// ubicación empresa
const negocio = [43.299549, -8.359802]; 

// crear mapa
const mapContainer = document.getElementById("map");

if(mapContainer){
    const map = L.map("map").setView([43.3671, -8.4082],13);
    
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
            "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    // marcador empresa
    L.marker(negocio) .addTo(map) .bindPopup("MAGG") .openPopup(); 

    // geolocalización cliente 
    navigator.geolocation.getCurrentPosition( 
        function(position){ 
            const cliente = [ 
                position.coords.latitude, position.coords.longitude 
            ]; 
            // calcular ruta 
            L.Routing.control({ 
                waypoints: [ 
                    L.latLng(cliente), 
                    L.latLng(negocio) 
                ], 
                routeWhileDragging: false, 
                draggableWaypoints: false, 
                addWaypoints: false, 
                show: false 
            }).addTo(map); 
        }, 
        function(){ 
            alert( "No se pudo obtener tu ubicación." ); 
        } 
    );
}

// Enviar por Whatsapp
function enviarConsulta() {
    const telefonoOficina = "34623262118"; // Sustituye por tu número de psicología
    const nombre = document.getElementById('nombreCompleto').value;
    const mensajeConsulta = document.getElementById('consulta').value;
    
    if (nombre === "" || mensajeConsulta === "") {
        alert("Por favor, rellena todos los campos.");
        return;
    }

    //Estructuramos el mensaje para que te llegue ordenado
    const textoFinal =
        "Hola, mi nombre es " + nombre + ".\n\n" +
        "Me gustaría solicitar información sobre sus servicios de construcción y diseño de viviendas.\n\n" +
        "Mensaje:\n" +
        mensajeConsulta;

    //Convertimos el texto a formato URL
    const url = "https://wa.me/" + telefonoOficina + "?text=" + encodeURIComponent(textoFinal);
    
    window.open(url, '_blank');
}

// Planos 

window.onload = function () {

    const botones =
    document.querySelectorAll(".plano-card button");

    // contenido distinto para cada plano
    const distribuciones = [

        {
            titulo: "Distribución Casa Moderna",
            items: [
                "Salón-comedor abierto",
                "Cocina integrada",
                "3 dormitorios",
                "2 baños",
                "Terraza exterior"
            ]
        },

        {
            titulo: "Distribución Casa Nórdica",
            items: [
                "Salón con chimenea",
                "Cocina americana",
                "4 dormitorios",
                "3 baños",
                "Jardín privado"
            ]
        },

        {
            titulo: "Distribución Casa Rural",
            items: [
                "Salón acogedor",
                "Cocina independiente",
                "2 dormitorios",
                "1 baño",
                "Porche exterior"
            ]
        }

    ];

    botones.forEach((boton, index) => {

        boton.addEventListener("click", function () {

            const card =
            this.closest(".plano-card");

            let detalle =
            card.querySelector(".plano-detalle");

            // crear panel solo una vez
            if (!detalle) {

                detalle =
                document.createElement("div");

                detalle.className =
                "plano-detalle";

                // obtener datos según la card
                const plano =
                distribuciones[index];

                detalle.innerHTML = `
                    <h4>${plano.titulo}</h4>

                    <ul>
                        ${plano.items
                            .map(item =>
                                `<li>${item}</li>`)
                            .join("")}
                    </ul>
                `;

                card.appendChild(detalle);

                // cerrar panel haciendo click
                detalle.addEventListener(
                    "click",
                    function () {

                        detalle.classList
                        .remove("activo");

                        boton.textContent =
                        "Ver plano";
                    }
                );
            }

            detalle.classList
            .toggle("activo");

            this.textContent =
            detalle.classList
            .contains("activo")
            ? "Cerrar plano"
            : "Ver plano";

        });

    });

};

//Formulario de presupuesto

// ===============================
// PRESUPUESTO
// ===============================

window.addEventListener("DOMContentLoaded", () => {

    const formulario =
    document.getElementById("formPresupuesto");

    // si no existe la página, salir
    if(!formulario) return;

    // inputs contacto
    const nombre =
    document.getElementById("nombre");

    const apellidos =
    document.getElementById("apellidos");

    const telefono =
    document.getElementById("telefono");

    const email =
    document.getElementById("email");

    // presupuesto
    const producto =
    document.getElementById("producto");

    const plazo =
    document.getElementById("plazo");

    const extras =
    document.querySelectorAll(".extra");

    const precioTotal =
    document.getElementById("precioTotal");

    // ==========================
    // VALIDACIONES
    // ==========================

    function validarNombre(texto){

        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,15}$/
        .test(texto);

    }

    function validarApellidos(texto){

        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,40}$/
        .test(texto);

    }

    function validarTelefono(texto){

        return /^[0-9]{9}$/
        .test(texto);

    }

    function validarEmail(texto){

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(texto);

    }

    // ==========================
    // CALCULAR PRESUPUESTO
    // ==========================

    function calcularPresupuesto(){

        // precio producto
        let total =
        parseInt(producto.value);

        // extras
        extras.forEach((extra)=>{

            if(extra.checked){

                total +=
                parseInt(extra.value);
            }

        });

        // descuento por plazo
        const meses =
        parseInt(plazo.value);

        let descuento = 0;

        if(meses >= 3 && meses < 6){

            descuento = 0.05;

        }else if(meses >= 6 &&
            meses < 12){

            descuento = 0.10;

        }else if(meses >= 12){

            descuento = 0.15;
        }

        total =
        total - (total * descuento);

        precioTotal.textContent =
        total.toLocaleString("es-ES")
        + "€";
    }

    // ==========================
    // EVENTOS
    // ==========================

    producto.addEventListener(
        "change",
        calcularPresupuesto
    );

    plazo.addEventListener(
        "input",
        calcularPresupuesto
    );

    extras.forEach((extra)=>{

        extra.addEventListener(
            "change",
            calcularPresupuesto
        );

    });

    // cálculo inicial
    calcularPresupuesto();

    // ==========================
    // VALIDAR FORMULARIO
    // ==========================

    formulario.addEventListener(
        "submit",
        function(event){

            let errores = [];

            if(
                !validarNombre(
                    nombre.value
                )
            ){

                errores.push(
                    "El nombre no es válido"
                );
            }

            if(
                !validarApellidos(
                    apellidos.value
                )
            ){

                errores.push(
                    "Los apellidos no son válidos"
                );
            }

            if(
                !validarTelefono(
                    telefono.value
                )
            ){

                errores.push(
                    "El teléfono debe tener 9 números"
                );
            }

            if(
                !validarEmail(
                    email.value
                )
            ){

                errores.push(
                    "El email no es válido"
                );
            }

            if(
                errores.length > 0
            ){

                event.preventDefault();

                alert(
                    errores.join("\n")
                );
            }
        }
    );

});

// ===============================
// SISTEMA DE COOKIES
// ===============================

const COOKIE_CONSENTIMIENTO = "magg_cookies_aceptadas";

function setCookie(nombre, valor, dias) {
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + dias * 24 * 60 * 60 * 1000);
    document.cookie = `${nombre}=${valor};expires=${fecha.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(nombre) {
    const clave = nombre + "=";
    const cookies = document.cookie.split(";");
    for (let c of cookies) {
        c = c.trim();
        if (c.startsWith(clave)) return c.substring(clave.length);
    }
    return null;
}

function deleteCookie(nombre) {
    document.cookie = `${nombre}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
}

function mostrarBannerCookies() {
    // No mostrar si ya hay decisión tomada
    if (getCookie(COOKIE_CONSENTIMIENTO)) return;

    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.innerHTML = `
        <div class="cookie-content">
            <p>
                Usamos cookies para recordar tus preferencias de idioma y mejorar tu experiencia.
                Consulta nuestra <a href="/views/politica-cookies.html">Política de cookies</a>.
            </p>
            <div class="cookie-botones">
                <button id="cookieAceptar">Aceptar</button>
                <button id="cookieRechazar">Rechazar</button>
            </div>
        </div>
    `;

    // Estilos inline para que funcione sin depender del CSS
    banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #2c1a0e;
        color: #f5f0eb;
        padding: 1rem 2rem;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
    `;

    banner.querySelector(".cookie-content").style.cssText = `
        display: flex;
        align-items: center;
        gap: 2rem;
        max-width: 900px;
        flex-wrap: wrap;
    `;

    banner.querySelector(".cookie-botones").style.cssText = `
        display: flex;
        gap: 0.75rem;
        flex-shrink: 0;
    `;

    const estiloBoton = `
        padding: 0.5rem 1.25rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        transition: opacity 0.2s;
    `;

    banner.querySelector("#cookieAceptar").style.cssText = estiloBoton + `
        background: #8B5E3C;
        color: #fff;
    `;

    banner.querySelector("#cookieRechazar").style.cssText = estiloBoton + `
        background: transparent;
        color: #f5f0eb;
        border: 1px solid #f5f0eb;
    `;

    banner.querySelector("a").style.cssText = `color: #d4a96a; text-decoration: underline;`;

    document.body.appendChild(banner);

    // Eventos
    document.getElementById("cookieAceptar").addEventListener("click", function () {
        setCookie(COOKIE_CONSENTIMIENTO, "true", 365);
        // Con consentimiento, guardar idioma en cookie además de localStorage
        const idioma = localStorage.getItem("idioma") || "es";
        setCookie("magg_idioma", idioma, 365);
        banner.remove();
    });

    document.getElementById("cookieRechazar").addEventListener("click", function () {
        setCookie(COOKIE_CONSENTIMIENTO, "false", 30);
        // Sin consentimiento, borrar cookie de idioma si existía
        deleteCookie("magg_idioma");
        banner.remove();
    });
}

// Sincronizar idioma con cookie si el usuario aceptó
function sincronizarIdiomaCookie(idioma) {
    if (getCookie(COOKIE_CONSENTIMIENTO) === "true") {
        setCookie("magg_idioma", idioma, 365);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    mostrarBannerCookies();
});

// ===============================
// FIN SISTEMA DE COOKIES
// ===============================

async function cargarIdioma(idioma) {
    try {
        const response = await fetch("/assets/json/idiomas.json");
        const data = await response.json();
        const traduccion = data[idioma];

        Object.keys(traduccion).forEach((id) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.innerText = traduccion[id];
            }
        });
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", function () {

    // Recuperar idioma guardado o usar español por defecto
    const idiomaGuardado = localStorage.getItem("idioma") || "es";
    const banderaActual = document.getElementById("banderaActual");

    // Aplicar idioma al cargar la página
    cargarIdioma(idiomaGuardado);

    // Cargar noticias si existe la sección
    if (document.getElementById("news-container")) {
        cargarNoticias(idiomaGuardado);
    }

    // Restaurar bandera
    const botonGuardado = document.querySelector(`.idioma-btn[data-lang="${idiomaGuardado}"]`);
    if (banderaActual && botonGuardado) {
        const img = botonGuardado.querySelector("img");
        banderaActual.src = img.src;
        banderaActual.alt = img.alt;
    }

    // Listeners de botones de idioma
    const botonesIdioma = document.querySelectorAll(".idioma-btn");

    botonesIdioma.forEach((boton) => {
        boton.addEventListener("click", function () {
            const idioma = this.dataset.lang;

            localStorage.setItem("idioma", idioma);
            sincronizarIdiomaCookie(idioma);
            cargarIdioma(idioma);

            if (document.getElementById("news-container")) {
                cargarNoticias(idioma);
            }

            // Copia el src directamente del botón clicado
            if (banderaActual) {
                const img = this.querySelector("img");
                banderaActual.src = img.src;
                banderaActual.alt = img.alt;
            }
        });
    });
});