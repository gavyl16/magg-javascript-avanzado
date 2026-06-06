/**
 * =============================================================
 * MAGG - Casas de Madera
 * Archivo: idioma.js
 * Descripción: Selector de idioma multilingüe.
 *   Carga las traducciones desde idiomas.json y actualiza
 *   todos los elementos del DOM que tengan un id coincidente.
 *   Persiste el idioma en localStorage y en cookie si el
 *   usuario aceptó el consentimiento.
 * Páginas: todas
 * Dependencias: cookies.js (para sincronizarIdiomaCookie)
 * =============================================================
 */

/**
 * Si el usuario aceptó las cookies, sincroniza el idioma
 * seleccionado en localStorage también en una cookie.
 * @param {string} idioma - Código de idioma seleccionado
 */
function sincronizarIdiomaCookie(idioma) {
    if (getCookie(COOKIE_CONSENTIMIENTO) === "true") {
        setCookie("magg_idioma", idioma, 365);
    }
}

/**
 * Descarga el JSON de traducciones y aplica el idioma al DOM.
 * Busca cada clave del JSON como id de elemento y actualiza su texto.
 * @param {string} idioma - Código de idioma: "es", "gl", "en" o "pt"
 */
async function cargarIdioma(idioma) {
    try {
        // Calcula la ruta base según la profundidad de la página actual
        // index.html está en la raíz, el resto en /views/ (un nivel más profundo)
        const segmentos = window.location.pathname.replace(/\/$/, "").split("/").filter(Boolean);
        const enSubpagina = segmentos[segmentos.length - 1].endsWith(".html") && segmentos.length > 1;
        const rutaJson = enSubpagina ? "../assets/json/idiomas.json" : "./assets/json/idiomas.json";

        const response = await fetch(rutaJson);
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

    // Cargar noticias en el idioma correcto si la sección existe en esta página
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

            // Aplicar traducciones en el nuevo idioma
            cargarIdioma(idioma);

            // Actualizar noticias si la sección existe en esta página
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