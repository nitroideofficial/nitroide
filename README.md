<div align="center">

<img src="https://nitroideofficial.github.io/nitroide/logo/logo_black.png" width="180"/>

# ⚡ NitroIDE

### Code locally. Execute instantly.

<p>
  <a href="https://nitroideofficial.github.io/nitroide/">
    <img src="https://img.shields.io/badge/Live-Demo-00e5ff?style=for-the-badge&logo=vercel&logoColor=black"/>
  </a>
  <a href="https://nitroideofficial.github.io/nitroide/docs.html">
    <img src="https://img.shields.io/badge/Documentation-bb9af7?style=for-the-badge"/>
  </a>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Made%20with-JavaScript-yellow?style=for-the-badge"/>
</p>

</div>

---

## 🚀 What is NitroIDE?

NitroIDE is a **zero-latency, browser-based IDE** that runs entirely on the client side. By utilizing HTML5 `srcdoc` iframes and local execution, there are no backend servers, no sign-ups, and absolutely zero delay.

Write, test, and export your HTML, CSS, and JavaScript projects with the exact same editing engine that powers VS Code.

> Your code runs instantly inside your browser's memory — just like it should.

---

## ✨ Features

* ⚡ **Zero-Latency Execution:** Your code compiles and renders locally in 0ms.
* 🔥 **Live DOM Preview:** Hot module replacement for CSS without reloading the iframe.
* 💻 **Monaco Editor Engine:** Full syntax highlighting, Emmet abbreviations, and formatting.
* 📦 **Virtual File System:** Manage multiple `.html`, `.css`, and `.js` modules natively.
* 🧠 **Developer Console:** Built-in CLI for executing commands and a state visualizer for JSON debugging.
* 📱 **Device Emulation:** Instantly test responsive breakpoints (Desktop, Tablet, Mobile).
* 🔒 **100% Absolute Privacy:** Your code never leaves your machine. No telemetry, no tracking.
* 💾 **1-Click Export:** Download your workspace as a production-ready `.zip` archive or a bundled single HTML file.

---

## 🖥️ Live Demo

👉 **[Launch the Workspace](https://nitroideofficial.github.io/nitroide/)**

---

## 🧠 Architectural Engine

Unlike traditional cloud playgrounds (CodePen, CodeSandbox) that rely on containerized backend servers to compile code, NitroIDE uses a purely serverless frontend architecture:

* **Execution:** `iframe + srcdoc` sandbox for secure, live evaluation.
* **Text Engine:** Monaco Editor instance running inside Web Workers.
* **Storage:** Local browser memory (`localStorage`) replaces databases.

Result:
👉 ⚡ **Zero latency**
👉 🔒 **Full privacy**

---

## 🛠️ CLI Commands

Stop relying on UI buttons. Use the integrated command line to control your environment:

```bash
> install tailwind  # Injects the Tailwind CDN
> install react     # Fetches React 18 from unpkg
> theme dark        # Toggles IDE aesthetic
> export zip        # Bundles VFS into an archive
> export html       # Exports a single-file build
> format            # Prettifies active buffers
> clear             # Wipes console history
