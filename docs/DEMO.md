# Demo Guide

> Everything you need to run a flawless live demo on hackathon day.

---

## The 90-Second Demo Script

### Setup (before you go on stage)
- App is open and running at localhost:5173
- Sample meeting notes are pre-copied in your clipboard
- PDF export has been tested at least once
- Browser zoom set to 125% so judges can read the screen

---

### Live Demo Flow

**[0:00 — 0:15] Hook**
> "Every student org officer knows this pain — you just had a 1-hour meeting,
> and now you have to write the recap, assign the tasks, and message three
> different channels. That takes another 45 minutes. MeetingMind does it in 30 seconds."

**[0:15 — 0:30] Show the input**
- Open the app
- Paste the sample meeting notes (see below)
- Say: *"These are real messy notes — no formatting, no structure, exactly
  what an officer would have after a meeting."*

**[0:30 — 0:55] Hit Process — show the output**
- Click "Process Notes"
- While it loads (3–5 sec): *"Claude is reading the full context of the meeting..."*
- Show Summary tab first
- Click Decisions tab: *"Every decision, clearly stated"*
- Click Action Items: *"Each task assigned to the right person, with a due date"*
- Click Comms: *"Three messages ready — casual GC, formal email, social post"*

**[0:55 — 1:10] The money moment**
- Click "Download PDF"
- Show the PDF opens
- Say: *"This is what used to take 45 minutes. We just did it in under a minute."*

**[1:10 — 1:30] Close**
> "MeetingMind directly addresses Communications, Knowledge & Documentation,
> and Task Tracking — three of the eight problem spaces in the brief.
> Every org runs meetings. Every officer has felt this pain. This is the fix."

---

## Sample Meeting Notes (use this for the demo)

```
org meeting nov 12
present: raine, kuya jeff, ate bea, marco, jd, patch

talked about the christmas party
- venue: either covered court or audio visual room
- jeff said covered court is free on dec 14, AV room needs reservation fee
- DECIDED: covered court on dec 14, jeff will confirm with SSG by friday
- budget is 3500 pesos total, bea is handling the liquidation

sponsorship update
- marco reached out to 3 local businesses, only 1 replied (Chowking Katipunan)
- they can give 500 worth of GCs if we put their tarpaulin at the event
- DECIDED: accept the sponsorship, patch will finalize the MOA by nov 15
- marco to follow up with the other 2 businesses this week

events committee
- jd presented the program flow, looks good
- needs emcee - raine volunteered but wants a co-host
- DECIDED: raine + bea as emcees, jd to send final program to everyone by nov 18

general reminders
- attendance has been low, 3 members missed last 2 meetings
- jeff will send reminder to the whole org
- next meeting: nov 19, same time
```

---

## Backup Plan (if internet dies)

1. **Screenshot backup** — take screenshots of a pre-run output and keep in a folder
2. **Offline talking points** — explain the 4 outputs verbally using the sample notes
3. **Show the code** — open `src/lib/claude.js` and walk through the prompt design
4. **GitHub** — show the repo as proof of a complete, documented project

---

## Judging Criteria Mapping

| Criterion | How MeetingMind addresses it |
|---|---|
| Problem relevance | Targets 3 of 8 problem spaces in the brief |
| Technical execution | Claude API + React + working PDF export |
| Innovation | AI that understands meeting context, not just formatting |
| Demo quality | Live input → output in under 30 seconds |
| Impact | Every student org runs meetings — universal daily pain |

---

## Frequently Asked Judge Questions

**"What if the notes are in Filipino?"**
> Claude handles multilingual input natively. The output language matches the input.

**"Is this just ChatGPT with a UI?"**
> No — the prompt is specifically engineered for student org context: it knows what
> a GC recap should sound like vs a formal email, and it understands org-specific
> language like "liquidation", "MOA", and "committee deliverables."

**"How does it know who to assign tasks to?"**
> Claude reads the full conversational context of the notes — if someone says
> "Jeff will confirm with SSG", it knows the owner is Jeff.

**"What happens to our meeting data?"**
> Nothing is stored on a server. Notes are sent to the Claude API for processing
> and immediately discarded. No database, no logging, no retention.

**"Can it handle voice?"**
> Not in the MVP — that's our first post-hackathon feature using Web Speech API.

---

## Pre-Demo Checklist

- [ ] `npm run dev` is running
- [ ] API key is set in `.env`
- [ ] Tested with sample notes at least 3 times
- [ ] PDF export works
- [ ] Copy buttons work
- [ ] Browser zoom at 125%
- [ ] Laptop is plugged in
- [ ] Tab with app is the only one open (no distractions)
- [ ] Sample notes are copied to clipboard
- [ ] GitHub repo is public and README looks clean
