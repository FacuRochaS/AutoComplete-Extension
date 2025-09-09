document.getElementById("mapear").addEventListener("click", () => {
    sendMessage("mapear");
});

document.getElementById("rellenar").addEventListener("click", () => {
    sendMessage("rellenar");
});

document.getElementById("limpiar").addEventListener("click", () => {
    sendMessage("limpiar");
});

function sendMessage(action) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action });
    });
}
