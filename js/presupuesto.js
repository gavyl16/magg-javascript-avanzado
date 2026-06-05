/**
 * =============================================================
 * MAGG - Casas de Madera
 * Archivo: presupuesto.js
 * Descripción: Calculadora de presupuesto y validación del
 *   formulario de solicitud.
 *   - Calcula el precio en tiempo real según producto, plazo
 *     y extras seleccionados.
 *   - Aplica descuentos por plazo de pago.
 *   - Valida los campos antes de permitir el envío.
 * Páginas: presupuestos.html
 * =============================================================
 */

window.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formPresupuesto");

    // Si no estamos en la página de presupuestos, no hacer nada
    if (!formulario) return;

    // Referencias a los campos del formulario
    const nombre      = document.getElementById("nombre");
    const apellidos   = document.getElementById("apellidos");
    const telefono    = document.getElementById("telefono");
    const email       = document.getElementById("email");
    const producto    = document.getElementById("producto");
    const plazo       = document.getElementById("plazo");
    const extras      = document.querySelectorAll(".extra");
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
