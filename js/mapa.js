/**
 * =============================================================
 * MAGG - Casas de Madera
 * Archivo: mapa.js
 * Descripción: Mapa interactivo con Leaflet.
 *   Muestra la ubicación de la empresa y calcula la ruta
 *   desde la posición del usuario si acepta la geolocalización.
 * Páginas: contacto.html
 * Dependencias: Leaflet CSS + JS, Leaflet Routing Machine
 * =============================================================
 */

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
