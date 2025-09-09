// Diccionario de referencia base
const referencia = {
    nombre: "nom",
    apellido: "ape",
    dni: "1"
};

// Escuchar los mensajes desde popup.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "mapear") {
        mapearCampos();
    }
    if (msg.action === "rellenar") {
        rellenarCampos();
    }
    if (msg.action === "limpiar") {
        limpiarMapeo();
    }
});

// Detecta el dominio actual
function getDomain() {
    return window.location.hostname;
}

// Guardar mapeo: el usuario escribió "nom", "ape", etc.
function mapearCampos() {
    const inputs = document.querySelectorAll("input, textarea, select");
    const domain = getDomain();
    let mapeo = {};

    inputs.forEach((input) => {
        const valor = input.value.trim();
        for (let key in referencia) {
            if (valor === referencia[key]) {
                mapeo[key] = obtenerSelectorUnico(input);
            }
        }
    });

    chrome.storage.sync.get([domain], (data) => {
        let actual = data[domain] || {};
        actual = { ...actual, ...mapeo };
        chrome.storage.sync.set({ [domain]: actual }, () => {
            alert("Mapeo guardado para " + domain);
        });
    });
}

// Rellenar campos con datos fijos de prueba
function rellenarCampos() {
    const domain = getDomain();
    chrome.storage.sync.get([domain], (data) => {
        const mapeo = data[domain] || {};
        const datos = {
            nombre: "Juan",
            apellido: "Pérez",
            dni: "12345678"
        };

        for (let key in mapeo) {
            const selector = mapeo[key];
            const input = document.querySelector(selector);
            if (input) input.value = datos[key] || "";
        }
    });
}

// Limpiar mapeo
function limpiarMapeo() {
    const domain = getDomain();
    chrome.storage.sync.remove(domain, () => {
        alert("Mapeo eliminado para " + domain);
    });
}

// Utilidad para obtener un selector único
function obtenerSelectorUnico(el) {
    if (el.id) return `#${el.id}`;
    if (el.name) return `[name="${el.name}"]`;
    return el.tagName.toLowerCase() + ":nth-of-type(" + (Array.from(el.parentNode.children).indexOf(el) + 1) + ")";
}
