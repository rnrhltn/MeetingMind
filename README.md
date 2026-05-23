# MeetingMind 🧠

> AI-powered meeting assistant for student organizations — paste messy notes, get structured summaries, action items, decisions, and channel-ready communications in seconds.

[![MIT License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Hackathon](https://img.shields.io/badge/built%20at-hackathon-blueviolet)]()
[![Claude API](https://img.shields.io/badge/powered%20by-Claude%20API-orange)]()
[![Solo Build](https://img.shields.io/badge/built%20by-1%20person-ff69b4)]()

---

## The Problem

Every student org runs meetings. Every meeting produces decisions, tasks, and updates that need to be communicated — yet most orgs still rely on one officer manually writing recaps, another chasing action items, and a third rewriting the same update for three different channels.

**MeetingMind eliminates that entirely.**

---

## What It Does

Paste any form of meeting notes — raw Zoom chat, voice-to-text transcript, or handwritten bullet points — and MeetingMind generates **4 structured outputs instantly**:

| Output | What it contains |
|---|---|
| **Meeting summary** | 2–3 sentence overview of what was discussed and decided |
| **Decisions log** | Every decision made, clearly phrased and timestamped |
| **Action items** | Tasks with assigned owners and inferred due dates |
| **Channel comms** | Tailored messages for group chat, email, and social posts |

---

## Problem Spaces Addressed

### 📢 Communications
- Auto-drafts GC recap, formal email, and social announcement from one paste
- Eliminates 30–45 min officers spend rewriting per channel

### 📚 Knowledge & Documentation
- Every meeting becomes a structured, searchable record
- Builds institutional memory across semesters

### ✅ Project & Task Tracking
- Extracts every action item with assigned owner and due date
- Exportable as checklist or Notion-ready table

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/your-username/meetingmind.git
cd meetingmind

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# → Add your ANTHROPIC_API_KEY in .env

# 4. Run the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
meetingmind/
├── public/
├── src/
│   ├── components/
│   │   ├── InputPanel.jsx       # Notes textarea + submit
│   │   ├── OutputTabs.jsx       # Summary / Decisions / Tasks / Comms
│   │   ├── ActionItems.jsx      # Task list with owners
│   │   └── ChannelComms.jsx     # GC / Email / Post drafts
│   ├── lib/
│   │   └── claude.js            # Anthropic API call + prompt
│   ├── App.jsx
│   └── main.jsx
├── docs/
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   └── AGENTS.md                # Sub-agent build instructions
├── .env.example
├── .env                         # ← never commit this
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React + Tailwind CSS |
| Build tool | Vite |
| AI Model | Claude claude-sonnet-4-20250514 (Anthropic) |
| PDF Export | jsPDF |
| Storage | localStorage (MVP) |

---

## Solo Build Strategy

This project was built solo using **Claude AI sub-agents** to parallelize development — each agent owned one slice of the codebase and worked independently.

See [`docs/AGENTS.md`](./docs/AGENTS.md) for the full sub-agent setup and prompts used.

---

## Before & After

| Without MeetingMind | With MeetingMind |
|---|---|
| 45 min writing recap after every meeting | 4 outputs in under 30 seconds |
| Action items lost after the meeting | Every task named, owned, and dated |
| GC recap sent 2 days later | Message ready before everyone logs off |
| New officers have zero context | Searchable decisions log from day one |

---

## Roadmap

- [x] Core note processing (MVP)
- [x] 4-output generation
- [ ] Voice recording input
- [ ] Past meetings archive + search
- [ ] Multi-user org vault
- [ ] Action item reminders via webhook

---

## Built By

**Rainier M. Holaton** — Solo @ Build with AI Asia Pacific College · May 5, 2026

> Designed, engineered, and shipped in one hackathon sprint using AI sub-agents.

---

## License

MIT © 2025 MeetingMind
