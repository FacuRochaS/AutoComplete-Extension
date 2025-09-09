// AutoComplete-Extension/content.js

const referencia = {

    nombre: "nom",
    apellido: "ape",

    dni: "1",
    nroAfiliado: "2",
    telefono: "3",

    fechaNacimiento: "2024-01-01",
    fechaConsulta: "2024-01-02",
    sexo: "M",
    email: "email@prueba.com",

    obraSocial: "OSDE",
    tipoAutorizacion: "Consulta",
    observaciones: "obsPrueba",
    terminos: "true",
    prioridad: "alta"
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "mapear") mapearCampos();
    if (msg.action === "rellenar") rellenarCampos();
    if (msg.action === "limpiar") limpiarMapeo();
});

function getDomain() { return window.location.hostname; }

function normalizarValorInput(input) {
    if (input.type === "checkbox" || input.type === "radio") {
        return input.checked;
    }
    if (input.type === "date") {
        return input.value;
    }
    return input.value.trim();
}

function mapearCampos() {
    const inputs = document.querySelectorAll("input, select, textarea");
    const domain = getDomain();
    let mapeo = {};

    console.log("=== Mapeando campos ===");
    inputs.forEach((input) => {
        let valor = normalizarValorInput(input);
        console.log(`[Mapeo] Input:`, input, `Valor actual:`, valor);

        for (let key in referencia) {
            // Comparar booleanos y strings correctamente
            if (
                (typeof referencia[key] === "boolean" && valor === referencia[key]) ||
                (typeof referencia[key] !== "boolean" && valor == referencia[key])
            ) {
                mapeo[key] = {
                    selector: obtenerSelectorUnico(input),
                    type: input.type || input.tagName.toLowerCase()
                };
                console.log(`[Mapeo] Campo mapeado: ${key} ->`, mapeo[key]);
            }
        }
    });

    chrome.storage.sync.get([domain], (data) => {
        let actual = data[domain] || {};
        actual = { ...actual, ...mapeo };
        chrome.storage.sync.set({ [domain]: actual }, () => {
            console.log("Mapeo final guardado:", actual);
            alert("Mapeo guardado para " + domain);
        });
    });
}

function rellenarCampos() {
    fetch(chrome.runtime.getURL("datosPrueba.json"))
        .then((res) => res.json())
        .then((datos) => {
            const domain = getDomain();
            chrome.storage.sync.get([domain], (data) => {
                const mapeo = data[domain] || {};
                console.log("=== Rellenando campos ===");
                for (let key in mapeo) {
                    const { selector, type } = mapeo[key];
                    const input = document.querySelector(selector);
                    let valor = datos[key];
                    console.log(`[Rellenar] Campo: ${key}, Selector: ${selector}, Tipo: ${type}, Valor:`, valor, "Input:", input);

                    if (!input) {
                        console.warn(`[Rellenar] No se encontró input para ${key} con selector ${selector}`);
                        continue;
                    }

                    if (type === "checkbox") {
                        input.checked = !!valor;
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                    } else if (type === "radio") {
                        const radios = document.querySelectorAll(`input[name="${input.name}"]`);
                        radios.forEach(radio => {
                            radio.checked = (radio.value == valor);
                            if (radio.checked) {
                                radio.dispatchEvent(new Event("change", { bubbles: true }));
                            }
                        });
                    } else if (input.tagName.toLowerCase() === "select") {
                        input.value = valor || "";
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                    } else if (type === "date") {
                        if (valor && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
                            input.value = valor;
                        } else if (valor) {
                            let d = new Date(valor);
                            if (!isNaN(d)) {
                                input.value = d.toISOString().slice(0, 10);
                            }
                        }
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                    else if (type === "number") {
                        input.value = valor != null ? String(valor) : "";
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                    else {
                        input.value = valor || "";
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                }
            });
        });
}

function limpiarMapeo() {
    const domain = getDomain();
    chrome.storage.sync.remove(domain, () => {
        alert("Mapeo eliminado para " + domain);
    });
}

function obtenerSelectorUnico(el) {
    if (el.id) return `#${el.id}`;
    if (el.name) return `[name="${el.name}"]`;
    let path = [];
    let elem = el;
    while (elem && elem.nodeType === 1 && elem.tagName.toLowerCase() !== "html") {
        let selector = elem.tagName.toLowerCase();
        if (elem.id) {
            selector += `#${elem.id}`;
            path.unshift(selector);
            break;
        } else {
            let siblings = Array.from(elem.parentNode.children).filter(e => e.tagName === elem.tagName);
            if (siblings.length > 1) {
                selector += `:nth-of-type(${Array.from(elem.parentNode.children).indexOf(elem) + 1})`;
            }
        }
        path.unshift(selector);
        elem = elem.parentNode;
    }
    return path.join(" > ");
}