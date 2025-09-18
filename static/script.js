document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const clearBtn = document.getElementById("clearBtn");
    const transcricaoDiv = document.getElementById("transcricao");
    const led = document.getElementById("status-led");

    const fontSelect = document.getElementById("fontSelect");
    const sizeSelect = document.getElementById("sizeSelect");

    let transcrevendo = false;

    startBtn.addEventListener("click", () => {
        fetch("/start").then(() => {
            transcrevendo = true;
            led.style.background = "red";
            led.style.animation = "blink 1s infinite";
        });
    });

    stopBtn.addEventListener("click", () => {
        fetch("/stop").then(() => {
            transcrevendo = false;
            led.style.background = "red";
            led.style.animation = "none";
        });
    });

    downloadBtn.addEventListener("click", () => {
        window.location.href = "/download";
    });

    clearBtn.addEventListener("click", () => {
        fetch("/limpar").then(() => {
            transcricaoDiv.innerHTML = "";
        });
    });

    fontSelect.addEventListener("change", () => {
        transcricaoDiv.style.fontFamily = fontSelect.value;
    });

    sizeSelect.addEventListener("change", () => {
        transcricaoDiv.style.fontSize = sizeSelect.value;
    });

    async function atualizarTranscricao() {
        try {
            const res = await fetch('/get_transcricao');
            if (!res.ok) throw new Error('Falha rede');

            const data = await res.json();
            const historico = data.historico || "";
            const parcial = data.parcial || "";

            transcricaoDiv.innerHTML = "";

            if (historico) {
                const histDiv = document.createElement("div");
                histDiv.innerHTML = historico.replace(/\n/g, "<br>");
                transcricaoDiv.appendChild(histDiv);
            }

            if (parcial) {
                const span = document.createElement("span");
                span.className = "parcial";
                span.textContent = " " + parcial;
                transcricaoDiv.appendChild(span);
            }

            transcricaoDiv.scrollTop = transcricaoDiv.scrollHeight;

        } catch (err) {
            console.debug("Erro ao buscar transcrição:", err);
        }
    }

    atualizarTranscricao();
    setInterval(atualizarTranscricao, 500);
});
