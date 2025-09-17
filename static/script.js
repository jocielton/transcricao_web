const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");
const transcricaoDiv = document.getElementById("transcricao");
const led = document.getElementById("status-led");
const fontSelect = document.getElementById("fontSelect");
const sizeSelect = document.getElementById("sizeSelect");

let transcrevendo = false;

// Iniciar transcrição
startBtn.addEventListener("click", () => {
    fetch("/start")
        .then(res => res.json())
        .then(data => {
            alert(data.mensagem);
            transcrevendo = true;
            led.style.opacity = 1; // LED acende
        });
});

// Parar transcrição
stopBtn.addEventListener("click", () => {
    fetch("/stop")
        .then(res => res.json())
        .then(data => {
            alert(data.mensagem);
            transcrevendo = false;
            led.style.opacity = 0; // LED apaga
        });
});

// Download da transcrição
downloadBtn.addEventListener("click", () => {
    window.location.href = "/download";
});

// Atualiza transcrição a cada segundo
setInterval(() => {
    fetch("/get_transcricao")
        .then(res => res.json())
        .then(data => {
            if (data.texto) {
                transcricaoDiv.textContent = data.texto;
                transcricaoDiv.scrollTop = transcricaoDiv.scrollHeight; // rolagem automática
            }
        });
}, 1000);

// Mudança dinâmica de fonte
fontSelect.addEventListener("change", () => {
    transcricaoDiv.style.fontFamily = fontSelect.value;
});

// Mudança dinâmica de tamanho da fonte
sizeSelect.addEventListener("change", () => {
    transcricaoDiv.style.fontSize = sizeSelect.value;
});
const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {
    fetch("/limpar")
        .then(res => res.json())
        .then(data => {
            alert(data.mensagem);
            transcricaoDiv.textContent = ""; // Limpa a div
        });
});

