/**
 * =============================================================
 * MAGG - Casas de Madera
 * Archivo: planos.js
 * Descripción: Visor de planos con panel desplegable.
 *   Al pulsar "Ver plano" se muestra una capa con la
 *   distribución interior. Al pulsar sobre esa capa, se cierra.
 * Páginas: productos.html
 * =============================================================
 */

window.addEventListener("DOMContentLoaded", function () {

    const botones = document.querySelectorAll(".plano-card button");

    // Si no hay botones de planos en esta página, no hacer nada
    if (!botones.length) return;

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
});
