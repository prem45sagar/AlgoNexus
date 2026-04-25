# 🚀 AlgoNexus

**The Ultimate DSA Mastery Engine & Personal Knowledge Workspace**

[![Local First Architecture](https://img.shields.io/badge/Architecture-Local--First-059669?style=for-the-badge)]()
[![Vite](https://img.shields.io/badge/Bundle-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache--2.0-orange?style=for-the-badge)](LICENSE)

---

**AlgoNexus** is a premium, full-stack platform designed for developers who are serious about their DSA (Data Structures and Algorithms) journey. It combines powerful organization, rich documentation tools, and deep analytics into a stunning glassmorphic interface.

[Explore Features](#-features) • [Tech Stack](#-technology-stack) • [Setup Guide](#-setup--installation) • [Architecture](#-project-structure)

</div>

---

## ✨ Features

### 🛠️ Problem Mastery Engine

- **One-Click Import:** Seamlessly import problems from LeetCode and other platforms using our built-in web scraper.
- **Custom Organization:** Group problems into folders with custom icons, track difficulty levels, and manage statuses (To-Do, Solved, Revised).
- **Rich Editor:** Document multiple approaches for every problem using a professional Markdown editor with integrated code snippets.

### 📝 Intelligent Notes System

- **Structured Knowledge:** Organize your conceptual notes into a hierarchy of folders and sub-notes.
- **Code First:** High-performance code editor (CodeMirror) support for multiple languages including Java, Python, C++, and more.
- **Markdown Support:** Full GFM (GitHub Flavored Markdown) support with LaTeX math equations and syntax highlighting.

### 🗺️ Dynamic Learning Roadmaps

- **Custom Paths:** Create and manage your own learning roadmaps to track long-term progress.
- **Milestone Tracking:** Break down complex topics into actionable steps and visualize your completion percentage.

### 📊 Performance Dashboard

- **Real-time Analytics:** Beautifully rendered charts (Recharts) showing your problem distribution by difficulty and status.
- **Activity Heatmap:** Track your solving consistency over time to stay motivated.
- **Global Sync:** Generate a unique **Sync Code** to port your entire local workspace between different devices instantly.

---

## 🎨 Design Philosophy

AlgoNexus features a **Modern Glassmorphic UI** designed for maximum focus and aesthetic pleasure:

- **Responsive Layout:** Optimized for all screen sizes, from 4K monitors to mobile devices.
- **Premium Aesthetics:** Dark-mode native with vibrant accents, subtle micro-animations (Framer Motion), and harmonious color palettes.
- **Interactive UX:** Fluid drag-and-drop interactions for organizing folders and items.

---

## 🛠️ Technology Stack

| Layer               | Technologies                                          |
| :------------------ | :---------------------------------------------------- |
| **Frontend**  | React 19, Vite, TailwindCSS 4, Framer Motion, Zustand |
| **Backend**   | Node.js, Express                                      |
| **Database**  | IndexedDB (Local-First Architecture)                  |
| **Charts**    | Recharts (Responsive & Aspect-Ratio Optimized)        |
| **Editor**    | CodeMirror, React-MD-Editor                           |
| **Utilities** | Axios, Cheerio, Turndown (Scraping), Lucide Icons     |

---

## 📦 Setup & Installation

### Prerequisites

- **Node.js** (v18+)

### 1. Clone the Repository

```bash
git clone https://github.com/prem45sagar/AlgoNexus.git
cd AlgoNexus
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
```

### 3. Install Dependencies

```bash
# Install all dependencies (Frontend and Backend are integrated)
npm install
```

### 4. Run the Application

From the root directory:

```bash
npm run dev
```

- **Application URL:** `http://localhost:3000`

---

## 📁 Project Structure

```text
AlgoNexus/
├── frontend/               # React SPA (Vite)
│   ├── src/
│   │   ├── components/     # Shared UI Components (Glassmorphic)
│   │   ├── pages/          # Main Views (Notes, Problems, Dashboard)
│   │   ├── lib/            # Local-First DB logic (IndexedDB), stores (Zustand)
│   │   └── main.jsx        # Routing & Core Layout
│   ├── index.html          # Vite Entry Template
│   └── vite.config.js      # Vite Configuration
├── backend/                # Node.js API
│   ├── routes/             # API Route Handlers
│   └── server.js           # Express Entry Point (Serves Vite & Scraper API)
├── package.json            # Root Dependencies & Scripts
└── README.md               # You are here!
```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn and create.

1. **Fork** the Project
2. Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 📄 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.

<div align="center">

Developed with ❤️ by [Prem Sagar](https://github.com/prem45sagar)

[Back to top](#-algonexus)

</div>
