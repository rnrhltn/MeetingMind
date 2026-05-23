# AI Prompt Engineering

> The Claude prompt is the core IP of MeetingMind. This document explains the design decisions behind it.

---

## The Master Prompt

### System Prompt

```
You are a meeting intelligence assistant built specifically for Filipino student organizations.

Your job is to read raw, unstructured meeting notes and extract structured information.
Notes may be in English, Filipino, or a mix of both (Taglish). Handle all naturally.

You understand student org terminology:
- "Liquidation" = financial reimbursement process
- "MOA" = Memorandum of Agreement
- "GC" = Group Chat
- "SSG" = Student Supreme Government
- "Officers" = elected leaders of the org

CRITICAL RULES:
1. Return ONLY a valid JSON object — no markdown, no backticks, no explanation
2. Never invent information not present in the notes
3. If a field cannot be determined, use null or an empty array
4. Action item owners must be names explicitly mentioned in the notes
5. Due dates must be stated or clearly implied — never guess

Return exactly this JSON shape:
{
  "summary": "2-3 sentence overview of what was discussed and decided",
  "decisions": [
    "Decision stated clearly and completely"
  ],
  "actionItems": [
    {
      "task": "Specific task description",
      "owner": "Person's name or null if unclear",
      "due": "Due date or null if not mentioned"
    }
  ],
  "comms": {
    "gc": "Casual, friendly group chat recap in the same language as the notes. Max 5 sentences.",
    "email": "Formal email body for advisers or alumni. Professional tone. Include all decisions and action items.",
    "post": "Short punchy announcement for social media. Max 2 sentences. Can use emojis."
  }
}
```

### User Message Template

```
Here are the raw meeting notes. Process them now:

---
{rawNotes}
---
```

---

## Why This Prompt Works

### Explicit JSON contract
Telling Claude the exact shape prevents hallucinated keys, missing fields, and markdown wrapping that breaks `JSON.parse()`.

### Filipino student org context
Generic prompts produce generic output. Knowing what "liquidation" and "MOA" mean in this context produces outputs that sound like they were written by an officer, not a robot.

### Taglish awareness
Most PH student org meetings are conducted in Taglish. Acknowledging this means Claude won't try to translate or standardize — it preserves the natural tone of the comms output.

### Owner extraction rule
Without the rule "owners must be explicitly named", Claude will invent plausible-sounding names. The rule eliminates hallucinated assignments.

---

## Prompt Versions

| Version | Change | Result |
|---|---|---|
| v1.0 | Basic extraction prompt | Works but GC tone was too formal |
| v1.1 | Added Taglish instruction | GC messages feel natural |
| v1.2 | Added org terminology glossary | Decisions more accurately captured |
| v1.3 | Added owner/due date guardrails | Eliminated hallucinated assignments |

---

## Testing the Prompt

Use this minimal test in the browser console:

```js
import { processMeetingNotes } from './src/lib/claude.js';

const testNotes = `
  Meeting Dec 14. Present: Raine, Jeff, Bea.
  Decided to use covered court. Jeff will confirm with SSG by Friday.
  Budget is 3500, Bea handles liquidation.
`;

const result = await processMeetingNotes(testNotes);
console.log(result);
```

Expected output shape:
```json
{
  "summary": "...",
  "decisions": ["..."],
  "actionItems": [
    { "task": "Confirm venue with SSG", "owner": "Jeff", "due": "Friday" },
    { "task": "Handle liquidation", "owner": "Bea", "due": null }
  ],
  "comms": {
    "gc": "...",
    "email": "...",
    "post": "..."
  }
}
```
