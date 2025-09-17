from flask import Flask, render_template, jsonify, send_file
import speech_recognition as sr
from datetime import datetime
import threading
import time

app = Flask(__name__)

# Estado global
transcrevendo = False
transcricao_total = []

# Inicializa arquivo
def iniciar_arquivo():
    with open("transcricao.txt", "a", encoding="utf-8") as f:
        f.write(f"\n=== Nova sessão de transcrição iniciada em {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===\n\n")

iniciar_arquivo()

recognizer = sr.Recognizer()
microfone = sr.Microphone()

def ouvir_microfone():
    global transcrevendo, transcricao_total
    with microfone as source:
        recognizer.adjust_for_ambient_noise(source)
        while True:
            if not transcrevendo:
                time.sleep(0.5)
                continue
            try:
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=7)
                texto = recognizer.recognize_google(audio, language="pt-BR").strip()
                if texto:
                    transcricao_total.append(texto)
                    timestamp = datetime.now().strftime('%H:%M:%S')
                    with open("transcricao.txt", "a", encoding="utf-8") as f:
                        f.write(f"[{timestamp}] {texto}\n")
            except (sr.WaitTimeoutError, sr.UnknownValueError):
                pass
            except sr.RequestError as e:
                print("Erro no serviço de reconhecimento:", e)
                break

# Thread para não bloquear Flask
thread = threading.Thread(target=ouvir_microfone)
thread.daemon = True
thread.start()

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
    return jsonify({"texto": "\n".join(transcricao_total)})

@app.route("/download")
def download_transcricao():
    return send_file("transcricao.txt", as_attachment=True)

@app.route("/limpar")
def limpar_transcricao():
    global transcricao_total
    with open("transcricao.txt", "a", encoding="utf-8") as f:
        f.write(f"\n=== Sessão encerrada em {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===\n\n")
    transcricao_total = []
    iniciar_arquivo()
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)
