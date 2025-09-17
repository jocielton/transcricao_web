document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos ---
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const transcricaoDiv = document.getElementById("transcricao");
    const led = document.getElementById("status-led");
    const fontSelect = document.getElementById("fontSelect");
    const sizeSelect = document.getElementById("sizeSelect");
    const clearBtn = document.getElementById("clearBtn");

    // --- Estado ---
    let transcrevendo = false;
    let maximizado = false;

    // --- Botão Maximizar ---
    const maximizeBtn = document.createElement("button");
    maximizeBtn.textContent = "⛶";
    maximizeBtn.title = "Maximizar / Restaurar";
    maximizeBtn.style.position = "absolute";
    maximizeBtn.style.top = "8px";
    maximizeBtn.style.right = "8px";
    maximizeBtn.style.padding = "4px 8px";
    maximizeBtn.style.fontSize = "14px";
    maximizeBtn.style.cursor = "pointer";
    maximizeBtn.style.zIndex = "100";

    // adiciona dentro da área de transcrição (com posição relativa)
    transcricaoDiv.style.position = "relative";
    transcricaoDiv.appendChild(maximizeBtn);

    maximizeBtn.addEventListener("click", () => {
        if (!maximizado) {
            transcricaoDiv.style.position = "fixed";
            transcricaoDiv.style.top = "0";
            transcricaoDiv.style.left = "0";
            transcricaoDiv.style.width = "100%";
            transcricaoDiv.style.height = "100%";
            transcricaoDiv.style.zIndex = "9999";
            transcricaoDiv.style.background = "#000";
            maximizado = true;
        } else {
            transcricaoDiv.style.position = "relative";
            transcricaoDiv.style.width = "";
            transcricaoDiv.style.height = "320px";
            transcricaoDiv.style.zIndex = "";
            transcricaoDiv.style.background = "#000";
            maximizado = false;
        }
    });

    // --- Funções de controle ---
    startBtn.addEventListener("click", () => {
        fetch("/start").then(r => r.json()).then(data => {
            alert(data.mensagem);
            transcrevendo = true;
            led.style.opacity = 1;
        }).catch(e => console.error("start error:", e));
    });

    stopBtn.addEventListener("click", () => {
        fetch("/stop").then(r => r.json()).then(data => {
            alert(data.mensagem);
            transcrevendo = false;
            led.style.opacity = 0;
        }).catch(e => console.error("stop error:", e));
    });

    downloadBtn.addEventListener("click", () => {
        window.location.href = "/download";
    });

    clearBtn.addEventListener("click", () => {
        fetch("/limpar").then(r => r.json()).then(data => {
            alert(data.mensagem);
            transcricaoDiv.textContent = "";
        }).catch(e => console.error("clear error:", e));
    });

    fontSelect.addEventListener("change", () => {
        transcricaoDiv.style.fontFamily = fontSelect.value;
    });

    sizeSelect.addEventListener("change", () => {
        transcricaoDiv.style.fontSize = sizeSelect.value;
    });

    // --- Atualização em tempo real ---
    async function atualizarTranscricao() {
        try {
            const res = await fetch('/get_transcricao');
            if (!res.ok) throw new Error('network');
            const data = await res.json();
            const texto = data.texto || '';
            transcricaoDiv.textContent = texto;

            // recoloca botão dentro do texto (pois textContent apaga filhos)
            transcricaoDiv.appendChild(maximizeBtn);

            transcricaoDiv.scrollTop = transcricaoDiv.scrollHeight;
        } catch (err) {
            console.debug("Erro ao buscar transcrição:", err);
        }
    }

    atualizarTranscricao();
    setInterval(atualizarTranscricao, 800);
});
