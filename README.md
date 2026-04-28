# ApplyMate ⚡

A modern, lightweight desktop productivity application built to help students and professionals quickly copy-paste frequently used answers, links, and information while applying for internships and jobs. 

Designed to act as a **central hub** for all your application materials.

---

## 🎯 Features

- **🔗 Links Section**: Instantly access and copy URLs for your Portfolio, GitHub, LinkedIn, Resume, LeetCode, etc.
- **📝 Answers Section**: Pre-store answers for common behavioral and technical questions (e.g., "Tell me about yourself", "Why should we hire you?").
- **⚡ Quick Copy**: Pin your most-used answers and use keyboard shortcuts (`Ctrl+1` to `Ctrl+9`) for instant copying without opening the app window.
- **🏷️ Tagging System**: Organize answers by tags like `AI`, `Backend`, `HR`, and `General`.
- **🔍 Instant Search**: Fast, real-time filtering across all your links and answers.
- **📋 Copy History**: Never lose track of what you just copied.
- **📌 Always-on-Top**: Keep the window floating above job application forms for seamless access.
- **💾 Auto-save & Persistence**: All edits are saved automatically to your local machine.
- **🎨 Modern UI**: Clean, distraction-free Dark/Light mode interface.
- **📁 Import/Export**: Easily backup or share your application data via JSON.

---

## 🛠️ Technology Stack

- **[Electron.js](https://www.electronjs.org/)** - Desktop application framework
- **Vanilla HTML/CSS/JS** - Lightweight, lightning-fast rendering without frontend framework overhead
- **Node.js** - Main process logic and local file system access

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shlokdhanokar/ApplyMate.git
   cd ApplyMate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application in development mode:
   ```bash
   npm start
   ```

### Building the Executable (Windows)

To package the application into a standalone `.exe` installer:

```bash
npm run build
```

The output installer will be located in the `dist/` directory.

---

## 📂 Project Structure

```text
ApplyMate/
├── package.json
├── src/
│   ├── main/
│   │   ├── main.js              # Electron main process
│   │   ├── store.js             # JSON persistence logic
│   │   └── ipc-handlers.js      # Inter-process communication handlers
│   ├── preload/
│   │   └── preload.js           # Secure contextBridge API
│   └── renderer/
│       ├── index.html           # Main application UI
│       ├── styles/
│       │   └── main.css         # Styling (Dark/Light themes)
│       └── js/
│           ├── app.js           # State management & routing
│           ├── links.js         # Links module
│           ├── answers.js       # Answers module
│           ├── quickcopy.js     # Quick copy module
│           └── utils.js         # Helper functions
```

---

## 👨‍💻 Author

**Your Name**
- Portfolio: [yourportfolio.com](https://yourportfolio.com)
- LinkedIn: [@yourusername](https://www.linkedin.com/in/yourusername)
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 📄 License

This project is licensed under the MIT License.
