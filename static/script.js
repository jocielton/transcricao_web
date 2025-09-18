document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const transcricaoDiv = document.getElementById("transcricao");
    const led = document.getElementById("status-led");
    const fontSelect = document.getElementById("fontSelect");
    const sizeSelect = document.getElementById("sizeSelect");
    const clearBtn = document.getElementById("clearBtn");
    const maximizeBtn = document.getElementById("maximizeBtn");

    let maximizado = false;

    startBtn.addEventListener("click", () => {
        fetch("/start").then(r => r.json()).then(() => {
            led.style.opacity = 1;
            led.classList.add("blink");
        });
    });

    stopBtn.addEventListener("click", () => {
        fetch("/stop").then(r => r.json()).then(() => {
            led.classList.remove("blink");
            led.style.opacity = 1; // fica vermelho estático
        });
    });

    downloadBtn.addEventListener("click", () => {
        window.location.href = "/download";
    });

    clearBtn.addEventListener("click", () => {
        fetch("/limpar").then(r => r.json()).then(() => {
            transcricaoDiv.innerHTML = '<button id="maximizeBtn">⛶</button><div id="status-led" class="led"></div>';
        });
    });

    fontSelect.addEventListener("change", () => {
        transcricaoDiv.style.fontFamily = fontSelect.value;
    });

    sizeSelect.addEventListener("change", () => {
        transcricaoDiv.style.fontSize = sizeSelect.value;
    });

    maximizeBtn.addEventListener("click", () => {
        if (!maximizado) {
            transcricaoDiv.style.position = "fixed";
            transcricaoDiv.style.top = "0";
            transcricaoDiv.style.left = "0";
            transcricaoDiv.style.width = "100%";
            transcricaoDiv.style.height = "100%";
            transcricaoDiv.style.zIndex = "2000";
            maximizado = true;
        } else {
            transcricaoDiv.style.position = "relative";
            transcricaoDiv.style.width = "";
            transcricaoDiv.style.height = "320px";
            transcricaoDiv.style.zIndex = "";
            maximizado = false;
        }
    });

    async function atualizarTranscricao() {
        try {
            const res = await fetch('/get_transcricao');
            if (!res.ok) throw new Error('network');
            const data = await res.json();
            const texto = data.texto || '';
            transcricaoDiv.innerHTML = texto + transcricaoDiv.innerHTML.match(/<button[\s\S]*<\/div>/g)[0];
            transcricaoDiv.scrollTop = transcricaoDiv.scrollHeight;
        } catch (err) {
            console.debug("Erro ao buscar transcrição:", err);
        }
    }

    atualizarTranscricao();
    setInterval(atualizarTranscricao, 800);
});
