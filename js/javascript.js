/**
 * =============================================================
 * MAGG - Casas de Madera
 * Archivo: javascript.js
 * Descripción: Lógica principal del sitio web. Incluye:
 *   - Carga dinámica de noticias (AJAX)
 *   - Mapa interactivo con Leaflet y geolocalización
 *   - Envío de consulta por WhatsApp
 *   - Visor de planos con panel desplegable
 *   - Formulario de presupuesto con validación
 *   - Sistema de cookies con banner de consentimiento
 *   - Selector de idioma multilingüe con persistencia
 * =============================================================
 */


/* =============================================================
   1. NOTICIAS
   Carga las noticias desde noticias.json y las renderiza
   en el contenedor #news-container según el idioma activo.
============================================================= */

/**
 * Obtiene y muestra las noticias del JSON en el idioma indicado.
 * @param {string} idioma - Código de idioma: "es", "gl", "en" o "pt"
 */
function cargarNoticias(idioma = "es") {

    fetch("/magg-javascript-avanzado/assets/json/noticias.json")

    .then(response => {

        // Si el servidor no responde correctamente, lanzar error
        if (!response.ok) {
            throw new Error("No se pudo cargar noticias.json");
        }

        return response.json();

    })

    .then(noticias => {

        const container = document.getElementById("news-container");

        // Limpiar noticias anteriores antes de insertar las nuevas
        container.innerHTML = "";

        // Crear una tarjeta por cada noticia
        noticias.forEach(noticia => {

            const article = document.createElement("article");
            article.classList.add("news-card");

            article.innerHTML = `
                <h4>${noticia[idioma].titulo}</h4>
                <p>${noticia[idioma].descripcion}</p>
            `;

            container.appendChild(article);
        });

    })

    .catch(error => {
        console.error("Error al cargar noticias:", error);
    });
}


/* =============================================================
   2. MAPA
   Inicializa el mapa Leaflet en la página de contacto,
   muestra la ubicación de la empresa y calcula la ruta
   desde la posición del usuario si acepta la geolocalización.
============================================================= */

// Coordenadas de la empresa
const negocio = [43.299549, -8.359802];

// Solo inicializar el mapa si el elemento #map existe en la página
const mapContainer = document.getElementById("map");

if (mapContainer) {

    // Centrar el mapa en A Coruña al cargar
    const map = L.map("map").setView([43.3671, -8.4082], 13);

    // Capa de tiles de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Marcador fijo con el nombre de la empresa
    L.marker(negocio).addTo(map).bindPopup("MAGG").openPopup();

    // Solicitar ubicación del usuario para calcular la ruta
    navigator.geolocation.getCurrentPosition(

        function (position) {

            const cliente = [
                position.coords.latitude,
                position.coords.longitude
            ];

            // Trazar ruta desde el cliente hasta la empresa
            L.Routing.control({
                waypoints: [
                    L.latLng(cliente),
                    L.latLng(negocio)
                ],
                routeWhileDragging: false,  // No recalcular al arrastrar
                draggableWaypoints: false,  // Puntos fijos
                addWaypoints: false,        // Sin puntos intermedios
                show: false                 // Ocultar panel de instrucciones
            }).addTo(map);
        },

        function () {
            // El usuario rechazó la geolocalización o no está disponible
            alert("No se pudo obtener tu ubicación.");
        }
    );
}


/* =============================================================
   3. WHATSAPP
   Construye un mensaje con los datos del formulario de contacto
   y abre WhatsApp con el texto prellenado.
============================================================= */

/**
 * Recoge los campos del formulario y redirige a WhatsApp
 * con el mensaje formateado.
 */
function enviarConsulta() {

    const telefonoOficina = "34623262118";
    const nombre = document.getElementById("nombreCompleto").value;
    const mensajeConsulta = document.getElementById("consulta").value;

    // Validar que los campos no estén vacíos
    if (nombre === "" || mensajeConsulta === "") {
        alert("Por favor, rellena todos los campos.");
        return;
    }

    // Construir el mensaje estructurado
    const textoFinal =
        "Hola, mi nombre es " + nombre + ".\n\n" +
        "Me gustaría solicitar información sobre sus servicios de construcción y diseño de viviendas.\n\n" +
        "Mensaje:\n" +
        mensajeConsulta;

    // Codificar el texto para usarlo como parámetro de URL
    const url = "https://wa.me/" + telefonoOficina + "?text=" + encodeURIComponent(textoFinal);

    // Abrir WhatsApp en una pestaña nueva
    window.open(url, "_blank");
}


/* =============================================================
   4. PLANOS
   Gestiona el panel desplegable de cada plano en productos.html.
   Al pulsar "Ver plano" se muestra una capa con la distribución
   interior. Al pulsar sobre esa capa, se cierra.
============================================================= */

window.onload = function () {

    const botones = document.querySelectorAll(".plano-card button");

    // Datos de distribución para cada plano (orden = orden en el DOM)
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

            const card = this.closest(".plano-card");
            let detalle = card.querySelector(".plano-detalle");

            // Crear el panel de detalle solo la primera vez que se abre
            if (!detalle) {

                detalle = document.createElement("div");
                detalle.className = "plano-detalle";

                const plano = distribuciones[index];

                detalle.innerHTML = `
                    <h4>${plano.titulo}</h4>
                    <ul>
                        ${plano.items.map(item => `<li>${item}</li>`).join("")}
                    </ul>
                `;

                card.appendChild(detalle);

                // Cerrar el panel al hacer clic sobre él
                detalle.addEventListener("click", function () {
                    detalle.classList.remove("activo");
                    boton.textContent = "Ver plano";
                });
            }

            // Alternar visibilidad del panel y texto del botón
            detalle.classList.toggle("activo");

            this.textContent = detalle.classList.contains("activo")
                ? "Cerrar plano"
                : "Ver plano";
        });
    });
};


/* =============================================================
   5. PRESUPUESTO
   Calcula el precio total en tiempo real según el producto,
   el plazo y los extras seleccionados. Aplica descuentos
   por plazo de pago. Valida el formulario antes de enviarlo.
============================================================= */

window.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formPresupuesto");

    // Si no estamos en la página de presupuestos, no hacer nada
    if (!formulario) return;

    // Referencias a los campos del formulario
    const nombre    = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const telefono  = document.getElementById("telefono");
    const email     = document.getElementById("email");
    const producto  = document.getElementById("producto");
    const plazo     = document.getElementById("plazo");
    const extras    = document.querySelectorAll(".extra");
    const precioTotal = document.getElementById("precioTotal");

    /* ----- Funciones de validación ----- */

    /** Solo letras y espacios, máximo 15 caracteres */
    function validarNombre(texto) {
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,15}$/.test(texto);
    }

    /** Solo letras y espacios, máximo 40 caracteres */
    function validarApellidos(texto) {
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,40}$/.test(texto);
    }

    /** Exactamente 9 dígitos */
    function validarTelefono(texto) {
        return /^[0-9]{9}$/.test(texto);
    }

    /** Formato básico de email */
    function validarEmail(texto) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
    }

    /* ----- Cálculo del presupuesto ----- */

    /**
     * Suma el precio base del producto seleccionado más los extras
     * marcados, y aplica un descuento según el plazo indicado:
     *   - 3 a 5 meses  → 5% de descuento
     *   - 6 a 11 meses → 10% de descuento
     *   - 12 o más     → 15% de descuento
     */
    function calcularPresupuesto() {

        let total = parseInt(producto.value);

        // Sumar extras seleccionados
        extras.forEach(extra => {
            if (extra.checked) {
                total += parseInt(extra.value);
            }
        });

        // Aplicar descuento según plazo
        const meses = parseInt(plazo.value);
        let descuento = 0;

        if (meses >= 3 && meses < 6) {
            descuento = 0.05;
        } else if (meses >= 6 && meses < 12) {
            descuento = 0.10;
        } else if (meses >= 12) {
            descuento = 0.15;
        }

        total = total - (total * descuento);

        // Mostrar el total con formato español (punto de miles, coma decimal)
        precioTotal.textContent = total.toLocaleString("es-ES") + "€";
    }

    /* ----- Eventos ----- */

    producto.addEventListener("change", calcularPresupuesto);
    plazo.addEventListener("input", calcularPresupuesto);
    extras.forEach(extra => extra.addEventListener("change", calcularPresupuesto));

    // Calcular el precio al cargar la página con los valores por defecto
    calcularPresupuesto();

    /* ----- Validación al enviar ----- */

    formulario.addEventListener("submit", function (event) {

        const errores = [];

        if (!validarNombre(nombre.value))       errores.push("El nombre no es válido");
        if (!validarApellidos(apellidos.value)) errores.push("Los apellidos no son válidos");
        if (!validarTelefono(telefono.value))   errores.push("El teléfono debe tener 9 números");
        if (!validarEmail(email.value))         errores.push("El email no es válido");

        // Si hay errores, bloquear el envío y mostrarlos
        if (errores.length > 0) {
            event.preventDefault();
            alert(errores.join("\n"));
        }
    });
});


/* =============================================================
   6. COOKIES
   Gestiona el consentimiento de cookies según el RGPD.
   Muestra un banner la primera vez que el usuario visita
   el sitio. Si acepta, guarda también el idioma en cookie.
   Si rechaza, solo se usa localStorage para el idioma.
============================================================= */

// Nombre de la cookie que almacena la decisión del usuario
const COOKIE_CONSENTIMIENTO = "magg_cookies_aceptadas";

/**
 * Guarda una cookie con una caducidad en días.
 * @param {string} nombre - Nombre de la cookie
 * @param {string} valor  - Valor a guardar
 * @param {number} dias   - Días hasta que expire
 */
function setCookie(nombre, valor, dias) {
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + dias * 24 * 60 * 60 * 1000);
    document.cookie = `${nombre}=${valor};expires=${fecha.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Obtiene el valor de una cookie por nombre.
 * @param {string} nombre - Nombre de la cookie
 * @returns {string|null} - Valor de la cookie o null si no existe
 */
function getCookie(nombre) {
    const clave = nombre + "=";
    const cookies = document.cookie.split(";");
    for (let c of cookies) {
        c = c.trim();
        if (c.startsWith(clave)) return c.substring(clave.length);
    }
    return null;
}

/**
 * Elimina una cookie estableciendo su fecha de expiración en el pasado.
 * @param {string} nombre - Nombre de la cookie a eliminar
 */
function deleteCookie(nombre) {
    document.cookie = `${nombre}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
}

/**
 * Crea e inyecta el banner de consentimiento de cookies en el DOM.
 * Solo se muestra si el usuario todavía no ha tomado ninguna decisión.
 */
function mostrarBannerCookies() {

    // Si ya existe una decisión guardada, no mostrar el banner
    if (getCookie(COOKIE_CONSENTIMIENTO)) return;

    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.innerHTML = `
        <div class="cookie-content">
            <p>
                Usamos cookies para recordar tus preferencias de idioma y mejorar tu experiencia.
                Consulta nuestra <a href="/magg-javascript-avanzado/views/politica-cookies.html">Política de cookies</a>.
            </p>
            <div class="cookie-botones">
                <button id="cookieAceptar">Aceptar</button>
                <button id="cookieRechazar">Rechazar</button>
            </div>
        </div>
    `;

    // Estilos inline para que el banner no dependa del CSS externo
    banner.style.cssText = `
        position: fixed; bottom: 0; left: 0; right: 0;
        background: #2c1a0e; color: #f5f0eb;
        padding: 1rem 2rem; z-index: 9999;
        display: flex; justify-content: center; align-items: center;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
        font-family: 'Inter', sans-serif; font-size: 0.9rem;
    `;

    banner.querySelector(".cookie-content").style.cssText = `
        display: flex; align-items: center;
        gap: 2rem; max-width: 900px; flex-wrap: wrap;
    `;

    banner.querySelector(".cookie-botones").style.cssText = `
        display: flex; gap: 0.75rem; flex-shrink: 0;
    `;

    const estiloBoton = `
        padding: 0.5rem 1.25rem; border: none; border-radius: 4px;
        cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: opacity 0.2s;
    `;

    banner.querySelector("#cookieAceptar").style.cssText = estiloBoton + `background: #8B5E3C; color: #fff;`;
    banner.querySelector("#cookieRechazar").style.cssText = estiloBoton + `background: transparent; color: #f5f0eb; border: 1px solid #f5f0eb;`;
    banner.querySelector("a").style.cssText = `color: #d4a96a; text-decoration: underline;`;

    document.body.appendChild(banner);

    // Aceptar: guardar consentimiento y el idioma actual en cookie
    document.getElementById("cookieAceptar").addEventListener("click", function () {
        setCookie(COOKIE_CONSENTIMIENTO, "true", 365);
        const idioma = localStorage.getItem("idioma") || "es";
        setCookie("magg_idioma", idioma, 365);
        banner.remove();
    });

    // Rechazar: guardar decisión negativa y eliminar cookie de idioma
    document.getElementById("cookieRechazar").addEventListener("click", function () {
        setCookie(COOKIE_CONSENTIMIENTO, "false", 30);
        deleteCookie("magg_idioma");
        banner.remove();
    });
}

/**
 * Si el usuario aceptó las cookies, sincroniza el idioma
 * seleccionado en localStorage también a una cookie.
 * @param {string} idioma - Código de idioma seleccionado
 */
function sincronizarIdiomaCookie(idioma) {
    if (getCookie(COOKIE_CONSENTIMIENTO) === "true") {
        setCookie("magg_idioma", idioma, 365);
    }
}

// Mostrar el banner al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    mostrarBannerCookies();
});


/* =============================================================
   7. SELECTOR DE IDIOMA
   Carga las traducciones desde idiomas.json y actualiza
   todos los elementos del DOM que tengan un id coincidente.
   Persiste el idioma elegido en localStorage (y en cookie
   si el usuario aceptó el consentimiento).
============================================================= */

/**
 * Descarga el JSON de traducciones y aplica el idioma al DOM.
 * Busca cada clave del JSON como id de elemento y actualiza su texto.
 * @param {string} idioma - Código de idioma: "es", "gl", "en" o "pt"
 */
async function cargarIdioma(idioma) {
    try {
        const response = await fetch("/magg-javascript-avanzado/assets/json/idiomas.json");
        const data = await response.json();
        const traduccion = data[idioma];

        Object.keys(traduccion).forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.innerText = traduccion[id];
            }
        });

    } catch (error) {
        console.error("Error al cargar idiomas.json:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {

    // Recuperar el idioma guardado o usar español por defecto
    const idiomaGuardado = localStorage.getItem("idioma") || "es";
    const banderaActual = document.getElementById("banderaActual");

    // Aplicar traducciones al cargar la página
    cargarIdioma(idiomaGuardado);

    // Cargar noticias en el idioma correcto si la sección existe
    if (document.getElementById("news-container")) {
        cargarNoticias(idiomaGuardado);
    }

    // Restaurar la bandera del idioma guardado
    const botonGuardado = document.querySelector(`.idioma-btn[data-lang="${idiomaGuardado}"]`);
    if (banderaActual && botonGuardado) {
        const img = botonGuardado.querySelector("img");
        banderaActual.src = img.src;
        banderaActual.alt = img.alt;
    }

    // Asignar listener a cada botón del selector de idioma
    const botonesIdioma = document.querySelectorAll(".idioma-btn");

    botonesIdioma.forEach(boton => {
        boton.addEventListener("click", function () {

            const idioma = this.dataset.lang;

            // Guardar elección en localStorage y sincronizar con cookie
            localStorage.setItem("idioma", idioma);
            sincronizarIdiomaCookie(idioma);

            // Aplicar traducciones y noticias en el nuevo idioma
            cargarIdioma(idioma);
            if (document.getElementById("news-container")) {
                cargarNoticias(idioma);
            }

            // Actualizar la bandera visible con la imagen del botón pulsado
            if (banderaActual) {
                const img = this.querySelector("img");
                banderaActual.src = img.src;
                banderaActual.alt = img.alt;
            }
        });
    });
});