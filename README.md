# 🎙️ Tatá - Transcrição e Legendas em Tempo Real

Aplicação web desenvolvida em **Python (Flask)**, **HTML**, **CSS** e **JavaScript**, que realiza **captura de voz em tempo real** e exibe o texto na tela em forma de **legenda automática**, com comandos por **voz** e **botões de controle**.  

O objetivo é tornar a comunicação mais **acessível para a comunidade surda**, exibindo legendas grandes e visíveis durante conversas, palestras ou apresentações.

---

## 🚀 Funcionalidades

- 🎤 **Captura de voz em tempo real** diretamente no navegador.  
- 📝 **Exibição das falas como legendas** na tela.  
- 🗣️ Controle por comandos de voz:  
  - `Iniciar Tatá` → Ativa a transcrição.  
  - `Encerrar Tatá` → Interrompe a transcrição.  
- 🟢🔴 **Botões de controle**:  
  - **Iniciar (verde)** → Ativa a transcrição.  
  - **Encerrar (vermelho)** → Interrompe a transcrição.  
- ⏱️ **Legendas temporárias**: as frases somem após alguns segundos, simulando legendas normais.  
- 💻 Interface simples, responsiva e com **alta visibilidade** (fonte grande em fundo escuro).

---

## 📂 Estrutura de Pastas

tata/
│── app.py # Servidor Flask
│── templates/
│ └── index.html # Página principal da aplicação
│── static/ # (Opcional) Arquivos CSS, JS, imagens extras
