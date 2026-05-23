# Architecture Overview

> Prototype-level architecture for the MeetingMind hackathon MVP.

---

## System Design

```
┌─────────────────────────────────────────────┐
│                  Browser                    │
│                                             │
│  ┌──────────┐        ┌───────────────────┐  │
│  │  Input   │──────▶ │   OutputTabs      │  │
│  │  Panel   │        │  Summary          │  │
│  │          │        │  Decisions        │  │
│  │ Textarea │        │  Action Items     │  │
│  │ + Submit │        │  Channel Comms    │  │
│  └──────────┘        └───────────────────┘  │
│        │                      ▲             │
│        ▼                      │             │
│  ┌──────────────────────────────────────┐   │
│  │           claude.js (lib)            │   │
│  │  Builds prompt → calls Claude API   │   │
│  │  Parses JSON response → returns     │   │
│  └──────────────────────────────────────┘   │
│        │                                    │
└────────│────────────────────────────────────┘
         │ HTTPS
         ▼
┌─────────────────────┐
│   Anthropic API     │
│  Claude claude-sonnet-4-20250514    │
└─────────────────────┘
```

---

## Data Flow

1. User pastes raw meeting notes into `InputPanel`
2. On submit, `claude.js` wraps notes in a structured prompt
3. Claude API returns a JSON object with 4 keys: `summary`, `decisions`, `actionItems`, `comms`
4. `OutputTabs` renders each key in its respective tab
5. User copies or downloads the output

---

## Core Prompt Design

The Claude API call uses a single system prompt that instructs the model to return **only valid JSON** with this shape:

```json
{
  "summary": "string",
  "decisions": ["string"],
  "actionItems": [
    {
      "task": "string",
      "owner": "string",
      "due": "string"
    }
  ],
  "comms": {
    "gc": "string",
    "email": "string",
    "post": "string"
  }
}
```

---

## Key Files

| File | Purpose |
|---|---|
| `src/lib/claude.js` | API call, prompt construction, JSON parsing |
| `src/components/InputPanel.jsx` | Notes input and submit trigger |
| `src/components/OutputTabs.jsx` | Tab switcher for 4 output types |
| `src/components/ActionItems.jsx` | Renders task list with owner badges |
| `src/components/ChannelComms.jsx` | GC / Email / Post with copy buttons |

---

## State Management

MVP uses **React useState only** — no Redux, no Zustand. State lives in `App.jsx`:

```js
const [notes, setNotes] = useState('');
const [output, setOutput] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

---

## MVP Constraints

- No backend server — Claude API called directly from the browser
- No database — output stored in `localStorage` for session persistence
- No auth — single-user prototype only
- No file uploads — text paste only for MVP

---

## Stretch Goals (Post-Hackathon)

| Feature | Additional Tech Needed |
|---|---|
| Voice input | Web Speech API / Whisper |
| Past meetings search | Supabase + pgvector |
| Multi-user vault | Supabase Auth + RLS |
| Action item reminders | Webhook / email service |
