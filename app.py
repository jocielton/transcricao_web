from flask import Flask, render_template, jsonify, send_file
from datetime import datetime
import threading
import time
import json
import os
import pyaudio
from vosk import Model, KaldiRecognizer

app = Flask(__name__)

# --- Estado global ---
transcrevendo = False
transcricao_total = []      # histórico confirmado
transcricao_parcial = ""    # palavras parciais em andamento

# --- Inicializa arquivo ---
def iniciar_arquivo():
    with open("transcricao.txt", "a", encoding="utf-8") as f:
        f.write(f"\n=== Nova sessão iniciada em {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===\n\n")

iniciar_arquivo()

# --- Configuração do Vosk ---
MODEL_PATH = "model-pt"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("⚠️ Baixe o modelo PT-BR do Vosk e coloque em 'model-pt'.")

model = Model(MODEL_PATH)
rec = KaldiRecognizer(model, 16000)

p = pyaudio.PyAudio()
stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000,
                input=True, frames_per_buffer=4000)
stream.start_stream()

# --- Thread de captura fluída ---
def ouvir_microfone():
    global transcrevendo, transcricao_total, transcricao_parcial
    while True:
        if not transcrevendo:
            time.sleep(0.3)
            continue

        data = stream.read(4000, exception_on_overflow=False)

        if rec.AcceptWaveform(data):
            # Resultado final (frase completa)
            result = json.loads(rec.Result())
            texto = result.get("text", "").strip()
            if texto:
                transcricao_total.append(texto)
                transcricao_parcial = ""
                timestamp = datetime.now().strftime('%H:%M:%S')
                with open("transcricao.txt", "a", encoding="utf-8") as f:
                    f.write(f"[{timestamp}] {texto}\n")
        else:
            # Resultado parcial (palavra em andamento)
            partial = json.loads(rec.PartialResult())
            transcricao_parcial = partial.get("partial", "")

# --- Inicia thread ---
thread = threading.Thread(target=ouvir_microfone)
thread.daemon = True
thread.start()

# --- Rotas Flask ---
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start")
def start_transcricao():
    global transcrevendo
    transcrevendo = True
    return jsonify({"status": "ok"})

@app.route("/stop")
def stop_transcricao():
    global transcrevendo
    transcrevendo = False
    return jsonify({"status": "ok"})

@app.route("/get_transcricao")
def get_transcricao():
    return jsonify({
        "historico": "\n".join(transcricao_total),
        "parcial": transcricao_parcial
    })

@app.route("/download")
def download_transcricao():
    return send_file("transcricao.txt", as_attachment=True)

@app.route("/limpar")
def limpar_transcricao():
    global transcricao_total, transcricao_parcial
    with open("transcricao.txt", "a", encoding="utf-8") as f:
        f.write(f"\n=== Sessão encerrada em {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===\n\n")
    transcricao_total = []
    transcricao_parcial = ""
    iniciar_arquivo()
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)
