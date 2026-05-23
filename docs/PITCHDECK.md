# Pitch Notes

> Talking points and slide outline for the hackathon presentation.

---

## Slide Structure (5 slides, 3 minutes)

### Slide 1 — The Problem
**Title:** "Student orgs run on meetings. Meetings run on chaos."

Talking points:
- Every org has a secretary whose unofficial job is writing recaps
- Action items decided in meetings vanish by the next day
- Same update gets rewritten 3 times for 3 different channels
- New officers start from zero every semester

**Visual:** Before/after time comparison (45 min → 30 seconds)

---

### Slide 2 — The Solution
**Title:** "MeetingMind — paste notes, get everything."

Talking points:
- One input: raw meeting notes in any format, any language
- Four outputs: summary, decisions, action items, channel comms
- Powered by Claude AI — understands student org context natively
- Works in English, Filipino, and Taglish

**Visual:** App screenshot showing the 4-tab output

---

### Slide 3 — Live Demo
**Title:** (no title — just demo)

- Paste the sample notes live
- Walk through each tab
- Download the PDF
- Let the output speak for itself

---

### Slide 4 — Problem Spaces Hit
**Title:** "Three problem spaces. One tool."

| Problem Space | How |
|---|---|
| Communications | GC, email, and social post drafted automatically |
| Knowledge & Documentation | Every meeting becomes a searchable record |
| Project & Task Tracking | Action items assigned, owned, and dated |

---

### Slide 5 — What's Next
**Title:** "Built in one sprint. Ready to scale."

- Voice recording input (Web Speech API)
- Searchable past meetings archive
- Multi-user org vault
- Action item reminders

**Close:** *"Every org in this room runs meetings. Every officer in this room has felt this pain. MeetingMind is the fix — and it works right now."*

---

## Key Numbers to Memorize
- **30 seconds** — time to process notes
- **3 problem spaces** — from the hackathon brief
- **4 outputs** — per meeting processed
- **0 servers** — no backend needed for MVP

---

## Anticipated Questions & Answers

**"Why Claude and not GPT-4?"**
> Claude has a larger context window and handles long meeting transcripts better.
> It also has stronger instruction-following for structured JSON output.

**"How long did this take to build?"**
> One hackathon sprint, built solo using AI sub-agents to parallelize development.

**"What's your go-to-market?"**
> Start with student orgs in one university, get feedback, expand to other schools.
> The tool is immediately useful with zero training required.
