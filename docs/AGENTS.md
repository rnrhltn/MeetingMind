# Sub-Agent Build System

> Solo hackathon strategy: run Claude as parallel sub-agents, each owning one slice of the codebase. You are the orchestrator — review, integrate, and ship.

---

## How This Works

Instead of coding everything yourself, you assign each component to a Claude conversation acting as a specialist agent. Each agent gets a focused prompt, returns working code, and you paste it into the right file.

```
YOU (Orchestrator)
├── Agent 1 → claude.js (AI integration)
├── Agent 2 → InputPanel.jsx (UI input)
├── Agent 3 → OutputTabs.jsx (UI output)
├── Agent 4 → ActionItems.jsx (task view)
├── Agent 5 → ChannelComms.jsx (comms view)
└── Agent 6 → App.jsx + styling (assembly)
```

**Rule:** Start Agent 1 first. All other agents depend on the JSON shape it returns.

---

## Agent 1 — AI Integration (`src/lib/claude.js`)

**Paste this prompt into a new Claude conversation:**

```
You are a senior frontend engineer building a React app called MeetingMind.

Your ONLY job: write the file `src/lib/claude.js`.

This file must:
1. Export an async function `processMeetingNotes(rawNotes)` 
2. Call the Anthropic API at https://api.anthropic.com/v1/messages
   - Model: claude-sonnet-4-20250514
   - API key from: import.meta.env.VITE_ANTHROPIC_API_KEY
3. Use this system prompt for Claude:
   "You are a meeting intelligence assistant for student organizations.
   Given raw meeting notes, extract and return ONLY a valid JSON object
   with no markdown, no explanation, no backticks. Just raw JSON."

4. Return a parsed JSON object with exactly this shape:
{
  "summary": "string — 2 to 3 sentence overview",
  "decisions": ["string", "string"],
  "actionItems": [
    { "task": "string", "owner": "string", "due": "string" }
  ],
  "comms": {
    "gc": "string — casual group chat message",
    "email": "string — formal email for advisers",
    "post": "string — short social media post"
  }
}

5. Handle errors gracefully — return null and console.error on failure.

Use fetch() only, no external libraries. Use async/await. Add clear comments.
Return the complete file content only, no explanation.
```

---

## Agent 2 — Input Panel (`src/components/InputPanel.jsx`)

**Paste this prompt into a new Claude conversation:**

```
You are a senior React + Tailwind CSS engineer.

Your ONLY job: write `src/components/InputPanel.jsx`.

Context:
- App is called MeetingMind — AI meeting assistant for student orgs
- This component is the left/top panel where users paste meeting notes
- On submit it calls processMeetingNotes() from src/lib/claude.js

Props this component receives:
- onSubmit(notes) — async function to call when user clicks Process
- isLoading — boolean, true while API call is in progress

Requirements:
1. Large textarea (min 200px tall) with placeholder:
   "Paste your meeting notes here — any format works.
    Zoom chat, voice-to-text, bullet points, anything."
2. A "Process Notes" button that:
   - Shows a spinner and "Processing..." when isLoading is true
   - Is disabled when textarea is empty or isLoading is true
3. A small helper text below: "Your notes are never stored or shared."
4. Clean, modern Tailwind styling — dark navy (#0F172A) header accent,
   white card body, teal (#0D9488) primary button color
5. Fully responsive — works on mobile and desktop

Return the complete file only. No explanation.
```

---

## Agent 3 — Output Tabs (`src/components/OutputTabs.jsx`)

**Paste this prompt into a new Claude conversation:**

```
You are a senior React + Tailwind CSS engineer.

Your ONLY job: write `src/components/OutputTabs.jsx`.

Context:
- App is MeetingMind — AI meeting assistant for student orgs
- This component shows the 4 outputs after notes are processed
- It receives the full output object and renders tabbed sections

Props:
- output — object with shape:
  {
    summary: "string",
    decisions: ["string"],
    actionItems: [{ task, owner, due }],
    comms: { gc, email, post }
  }

Requirements:
1. 4 tab buttons: Summary | Decisions | Action Items | Comms
2. Active tab highlighted in teal (#0D9488)
3. Summary tab: renders output.summary as a paragraph
4. Decisions tab: renders output.decisions as a numbered list
5. Action Items tab: renders a table with columns Task / Owner / Due
   — import and use ActionItems component from ./ActionItems
6. Comms tab: import and use ChannelComms from ./ChannelComms
7. A "Download PDF" button at the bottom right of every tab
   — on click, use jsPDF to export the current tab content as PDF
8. A "Copy" button per section that copies text to clipboard
   with a brief "Copied!" confirmation

Clean Tailwind styling, consistent with navy + teal color scheme.
Return the complete file only. No explanation.
```

---

## Agent 4 — Action Items (`src/components/ActionItems.jsx`)

**Paste this prompt into a new Claude conversation:**

```
You are a senior React + Tailwind CSS engineer.

Your ONLY job: write `src/components/ActionItems.jsx`.

Props:
- items — array of { task: string, owner: string, due: string }

Requirements:
1. Render a clean card list (not a table) — each item is a card with:
   - Task name in bold (14px)
   - Owner as a colored badge/pill (teal background, white text)
   - Due date with a calendar icon (use a simple unicode or SVG)
   - A checkbox on the left (visual only for MVP, no state needed)
2. If items is empty, show: "No action items found in these notes."
3. A "Copy all as checklist" button at the top right
   — formats as: "[ ] Task — Owner (Due: date)" per line, copies to clipboard
4. Tailwind styling, consistent with navy + teal color scheme

Return the complete file only. No explanation.
```

---

## Agent 5 — Channel Comms (`src/components/ChannelComms.jsx`)

**Paste this prompt into a new Claude conversation:**

```
You are a senior React + Tailwind CSS engineer.

Your ONLY job: write `src/components/ChannelComms.jsx`.

Props:
- comms — object with { gc: string, email: string, post: string }

Requirements:
1. Three sections stacked vertically, each in its own card:
   - 💬 Group Chat — shows comms.gc
   - 📧 Email — shows comms.email  
   - 📣 Social Post — shows comms.post
2. Each card has:
   - A colored header label (GC = amber, Email = blue, Post = purple)
   - The message text in a light gray box (easy to read and copy)
   - A "Copy" button top-right that copies that section's text
     with a "Copied!" flash confirmation (use useState + setTimeout)
3. Character count shown below each message (small, muted text)
4. Tailwind styling, consistent with navy + teal color scheme

Return the complete file only. No explanation.
```

---

## Agent 6 — App Assembly (`src/App.jsx`)

**Run this LAST — after all other agents are done:**

```
You are a senior React engineer doing final assembly.

Your ONLY job: write `src/App.jsx` that wires everything together.

Imports available:
- processMeetingNotes from ./lib/claude
- InputPanel from ./components/InputPanel
- OutputTabs from ./components/OutputTabs

Requirements:
1. State: notes (string), output (object|null), loading (bool), error (string|null)
2. handleSubmit(notes) async function:
   - sets loading true
   - calls processMeetingNotes(notes)
   - sets output with result
   - handles error → sets error state
   - sets loading false in finally block
3. Layout:
   - Full page, dark navy (#0F172A) background
   - Top navbar: "MeetingMind 🧠" logo left, tagline right
   - If output is null: show InputPanel centered (max-w-2xl)
   - If output exists: two-column layout — InputPanel left, OutputTabs right
   - If error: show a red error banner below the navbar
4. Smooth fade-in transition when output appears (Tailwind transition classes)
5. A "Start Over" button when output is showing — resets all state

Clean, professional. Tailwind only. No external UI libraries.
Return the complete file only. No explanation.
```

---

## Integration Order

```
1. Run Agent 1 → paste output into src/lib/claude.js
2. Run Agent 2 → paste output into src/components/InputPanel.jsx
3. Run Agent 4 → paste output into src/components/ActionItems.jsx
4. Run Agent 5 → paste output into src/components/ChannelComms.jsx
5. Run Agent 3 → paste output into src/components/OutputTabs.jsx
6. Run Agent 6 → paste output into src/App.jsx
7. Run npm run dev → test in browser
```

---

## Debugging Agent

**If something breaks, paste this into a new Claude conversation:**

```
You are a senior React debugger.

I am building MeetingMind — an AI meeting assistant using React + Vite + 
Tailwind + Anthropic Claude API.

Here is the error I'm seeing:
[PASTE ERROR HERE]

Here is the file that seems to be causing it:
[PASTE FILE CONTENT HERE]

Fix the issue and return the corrected complete file only.
```

---

## Time Budget (Solo Hackathon)

| Task | Est. Time |
|---|---|
| Project scaffold + env setup | 30 min |
| Run all 6 agents + paste code | 45 min |
| Test + debug integration | 45 min |
| UI polish pass | 30 min |
| PDF export check | 15 min |
| Demo prep + pitch script | 45 min |
| **Total** | **~3.5 hrs** |

> This leaves buffer time for unexpected issues — use it for polish, not new features.
