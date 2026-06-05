/**
 * =============================================================
 * MAGG - Casas de Madera
 * Archivo: cookies.js
 * Descripción: Gestión del consentimiento de cookies (RGPD).
 *   Muestra un banner la primera vez que el usuario visita
 *   el sitio. Guarda la decisión en una cookie para no
 *   volver a preguntar.
 * Páginas: todas
 * =============================================================
 */

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
                Consulta nuestra <a href="${RUTA_VIEWS}politica-cookies.html">Política de cookies</a>.
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

// Mostrar el banner al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    mostrarBannerCookies();
});
