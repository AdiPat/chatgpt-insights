# ChatGPT Insights 🤖

---

### Introduction 📖

Welcome to **ChatGPT Insights** — the tool that peeks under the hood of your ChatGPT interactions and hands you a shiny mirror 🪞 to reflect on your AI dialogues. Export your chat history, throw it into our program, and *bam!* 🚀 detailed insights about your ChatGPT conversations are at your fingertips.

---

### Explainable AI 🧠

In the age of "black-box" machine learning, **ChatGPT Insights** cracks the opaque facade.

- 🕵️‍♂️ **Transparency**: Understand your prompting style, the topics you gravitate toward, and how effectively you interact with ChatGPT.
- 📈 **Accountability**: Ever wonder why ChatGPT missed the mark? This tool helps you analyze ambiguous prompts and improve your own query game.
- 🎯 **Optimization**: Knowing *what* you ask and *how* you ask it is the key to extracting the full potential of generative AI.

Explainable AI isn't optional anymore; it's table stakes. 🃏

---

### Problem Statement ⚙️

1. **Understanding AI Interactions**: Users struggle to comprehend how their queries shape AI responses.
2. **Improving AI Utilization**: Lack of insight leads to inefficient usage of tools like ChatGPT.
3. **Actionable Insights**: Users need detailed, actionable feedback to enhance their interaction techniques.

---

### Setup 🛠️

#### Requirements

- Node.js >= 14.x
- TypeScript >= 4.x

#### Installation

```bash
npm install chatgpt-insights
```

#### Configuration

No complicated configurations here. Just point it to your exported ChatGPT data (ZIP file) and let it rip. ⚡

---

### Usage 💻

A simple, no-fuss example:

```typescript
import { analyzeChat } from 'chatgpt-insights';

const zipFilePath = '/path/to/your/chatgpt-export.zip';

(async () => {
  const insights = await analyzeChat(zipFilePath);
  console.log(insights);
})();
```

That’s it. No bells. No whistles. Just raw, unadulterated analysis. 💥

---

### Contributors 🙌

- **Aditya Patange** ([@adityapatange](https://github.com/adityapatange)): Architect of chaos. Creator of order.
- Too mysterious for names. Just know they're watching. 👀

Want to contribute? Fork, clone, and submit a PR. Prove your mettle. 🛡️

---

### LICENSE 📜

MIT License. Because freedom and openness trump all. Use it, improve it, break it (responsibly), and maybe even give credit where it's due.



---

> "Are you really alone in this world full of intelligent machines?" 👾

