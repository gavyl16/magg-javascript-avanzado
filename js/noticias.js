/**
 * =============================================================
 * MAGG - Casas de Madera
 * Archivo: noticias.js
 * Descripción: Carga dinámica de noticias desde noticias.json.
 *   Renderiza las tarjetas en el contenedor #news-container
 *   según el idioma activo.
 * Páginas: index.html
 * =============================================================
 */

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
