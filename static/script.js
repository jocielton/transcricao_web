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

    const presentationBtn = document.getElementById("presentationBtn");
    const presentationDiv = document.getElementById("presentationDiv");
    const textColorInput = document.getElementById("textColor");
    const bgColorInput = document.getElementById("bgColor");

    // --- Estado ---
    let isPresentation = false;
    let transcrevendo = false;

    // --- Cria área de texto da apresentação (uma vez) ---
    const presentationText = document.createElement("div");
    presentationText.className = "presentation-text";
    presentationDiv.appendChild(presentationText);

    // --- Cria botão Encerrar Apresentação (uma vez) ---
    const endBtn = document.createElement("button");
    endBtn.className = "end-btn";
    endBtn.textContent = "Encerrar Apresentação";
    endBtn.addEventListener("click", () => {
        // encerra apresentação
        isPresentation = false;
        presentationDiv.style.display = "none";
        presentationDiv.setAttribute('aria-hidden', 'true');
        document.querySelector(".container").style.display = "block";
    });
    presentationDiv.appendChild(endBtn);

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
            presentationText.textContent = "";
        }).catch(e => console.error("clear error:", e));
    });

    fontSelect.addEventListener("change", () => {
        transcricaoDiv.style.fontFamily = fontSelect.value;
        presentationText.style.fontFamily = fontSelect.value;
    });

    sizeSelect.addEventListener("change", () => {
        transcricaoDiv.style.fontSize = sizeSelect.value;
        presentationText.style.fontSize = sizeSelect.value;
    });

    // Cores do modo apresentação
    textColorInput.addEventListener("input", () => {
        presentationText.style.color = textColorInput.value;
    });
    bgColorInput.addEventListener("input", () => {
        presentationDiv.style.backgroundColor = bgColorInput.value;
    });

    // --- Ativa/desativa modo apresentação ---
    presentationBtn.addEventListener("click", () => {
        isPresentation = true;
        document.querySelector(".container").style.display = "none";
        presentationDiv.style.display = "flex";
        presentationDiv.setAttribute('aria-hidden', 'false');
        // garante que controles assumam valores atuais
        presentationText.style.color = textColorInput.value;
        presentationDiv.style.backgroundColor = bgColorInput.value;
        presentationText.style.fontFamily = fontSelect.value;
        presentationText.style.fontSize = sizeSelect.value;
    });

    // --- Atualização em tempo real ---
    async function atualizarTranscricao() {
        try {
            const res = await fetch('/get_transcricao');
            if (!res.ok) throw new Error('network');
            const data = await res.json();
            const texto = data.texto || '';
            // atualiza área normal
            transcricaoDiv.textContent = texto;
            transcricaoDiv.scrollTop = transcricaoDiv.scrollHeight;

            // atualiza modo apresentação se ativo
            if (isPresentation) {
                presentationText.textContent = texto;
                // rolagem suave (se necessário)
                presentationDiv.scrollTo({
                    top: presentationDiv.scrollHeight,
                    behavior: 'smooth'
                });
            }
        } catch (err) {
            // não interrompe o loop, apenas reporta no console
            console.debug("Erro ao buscar transcrição:", err);
        }
    }

    // roda rapidamente no início e depois a cada 800ms
    atualizarTranscricao();
    setInterval(atualizarTranscricao, 800);
});
