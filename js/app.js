// Bootstrap Tooltip
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Deshabilitar el menú al dar clic derecho.
document.oncontextmenu = (e) => {
    return false;
}

// Deshabilitar la tecla F12 y la combinación Ctrl + U.
document.onkeydown = (e) => {
    if (e.code === 'F12' || (e.ctrlKey && e.code === 'KeyU')) {
        return false;
    }
}

const inputText = document.getElementById('inputText'), // Obtenemos el textarea a encriptar/desencriptar por su id.
    outputText = document.getElementById('outputText'), // Obtenemos por su id del textarea para mostrar el texto encriptado/desencriptado.
    hiddenElements = document.getElementById('hidden'), // Obtenemos por su id el elemento padre para ocultar elementos
    showElements = document.getElementById('show');     // Obtenemos por su id el elemento padre para mostrar elementos

// Obtenemos los botones para encriptar, desencriptar y copiar, mediante su id.
const btnEncryptText = document.getElementById('encryptText'),
    btnDecryptText = document.getElementById('decryptText'),
    btnCopyOutputText = document.getElementById('copyOutputText');

/* 
    Obtenemos el id y clase de lo elementos HTML para mostrar al usuario mensajes 
    si el texto a encriptar no cumple con las validaciones.
*/
const hintClass = document.querySelector('.hint'),
    errorMessage = document.getElementById('error');

// Llaves para encriptar o desencriptar el texto
const keys = {
    e: 'enter',
    i: 'imes',
    a: 'ai',
    o: 'ober',
    u: 'ufat'
};

// Agregamos el evento 'input' a nuestro elemento <textarea> que contiene nuestro texto 
// para encriptar o desencriptar y usamos nuestra función para validar el texto.
inputText.addEventListener('input', (e) => {
    isValidInput(e.target.value);
});

// Agregamos el evento 'click' para el boton de copiar el texto de salida.
btnCopyOutputText.addEventListener('click', () => {
    copyText(outputText.value);
});

// Agregamos el evento 'click' para el boton encriptar el texto.
btnEncryptText.addEventListener('click', () => {
    outputText.value = encryptText(inputText.value);
    hideOrShowElements(true);
});

// Agregamos el evento 'click' para el boton desencriptar el texto.
btnDecryptText.addEventListener('click', () => {
    outputText.value = decryptText(inputText.value);
    hideOrShowElements(true);
});

// Validar el texto a encriptar o desencriptar
function isValidInput(input) {

    // Validamos que el texto no este vacío.
    if (!input) {
        setValidationAttributes('No ha ingresado el texto.', true);
        hideOrShowElements(false);
        return;
    }

    /*
      Verificamos con una expresión regular /[^a-z|ñ\s]+/g donde buscamos todos los 
        caracteres que sean distintos al rango de a-z o ñ.
    */
    if (!/[^a-z|ñ\s]+/g.test(input)) {
        // Si paso la validación regresamos los atributos
        setValidationAttributes('Solo letras minúsculas y sin acentos.', false, true);
        return;
    }

    // Mostramos un mensaje de error con el número de caracteres invalidos.
    // Con el método .match() nos devuelve un array todos estos caracteres y .length para saber el
    // número de estos.
    // y deshabilitamos los botones para encriptar o desencriptar

    setValidationAttributes(
        `Solo letras minúsculas y sin acentos. El texto contiene ${input.match(/[^a-z|ñ\s]+/g).length} caracteres Inválidos`,
        true);
    return;
}

// Función para deshabilitar/habilitar los botones y mostrar mensajes de error si los hay.
function setValidationAttributes(error, btnStatus, removeStyle = false, color = 'red') {
    errorMessage.innerHTML = error;
    hintClass.style.color = color;
    if (removeStyle) {
        hintClass.removeAttribute('style');
    }
    btnEncryptText.disabled = btnStatus;
    btnDecryptText.disabled = btnStatus;
}

// Función para mostrar o esconder los elementos según se necesite.
function hideOrShowElements(hide) {

    if (hide) {
        hiddenElements.classList.add('d-none');
        outputText.classList.add('message');
        showElements.classList.remove('d-none');
    } else {
        hiddenElements.classList.remove('d-none');
        outputText.classList.remove('message');
        showElements.classList.add('d-none');
    }

}

/*
    Función para para encriptar el texto de entrada.

    El método Object.entries() nos devuelve un array de un objeto dado, en este caso le pasamos el objeto 'keys' 
    que contiene el mapeo de las letras a encriptar. Con 'for of' recorremos el array obtenido, encriptamos el texto 
    con remplazando las letras según el mapeo de 'keys' con .replaceAll(). 'key' contiene la letra a remplazar y 'value' 
    el nuevo valor. Finalmente con un return devolvemos el texto encriptado.

*/

function encryptText(textToEncrypt) {
    let result = textToEncrypt;
    for (const [key, value] of Object.entries(keys)) {
        result = result.replaceAll(key, value);
    }
    return result;
}

/*
    Función para para desencriptar el texto de entrada.

    Realizamos el mismo proceso de encriptar el texto, con la diferencia que invertimos el 'value' y 'key' en el método
    .replaceAll() para desencriptar el texto.

*/
function decryptText(textToDecrypt) {
    let result = textToDecrypt;
    for (const [key, value] of Object.entries(keys)) {
        result = result.replaceAll(value, key);
    }
    return result;
}

// Función para copiar el texto.
function copyText(copyClipboard) {
    navigator.clipboard.writeText(copyClipboard).then(
        () => {
            // Mostrar una alerta si el texto se ha copiado correctamente.
            sweetAlertMessage('success', 'Copiado correctamente.');
        },
        () => {
            // Mostrar una alerta de error si ocurrió algún error.
            sweetAlertMessage('error', 'Error al copiar el texto');
        },
    );
}

// Alerta predeterminada con SweetAlert.
function sweetAlertMessage(icon, text) {
    Swal.fire({
        icon: icon,
        text: text,
        showConfirmButton: false,
        timer: 1500
    });
}