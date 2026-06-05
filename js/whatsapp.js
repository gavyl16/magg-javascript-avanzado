/**
 * =============================================================
 * MAGG - Casas de Madera
 * Archivo: whatsapp.js
 * Descripción: Envío de consulta por WhatsApp.
 *   Construye un mensaje con los datos del formulario
 *   y abre WhatsApp con el texto prellenado.
 * Páginas: contacto.html
 * =============================================================
 */

/**
 * Recoge los campos del formulario y redirige a WhatsApp
 * con el mensaje formateado.
 * Se llama desde el atributo onclick del botón en el HTML.
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
