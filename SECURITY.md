# Security

> Hackathon prototype security notes.

---

## API Key Handling

**Never commit your `.env` file.** It is in `.gitignore` by default.

The Anthropic API key is prefixed with `VITE_` so Vite exposes it to the browser. This is acceptable for a hackathon prototype where the goal is a working demo — not a production deployment.

For production, API calls should be proxied through a backend server so the key is never exposed to the client.

---

## Data Privacy

- Meeting notes are sent to the Anthropic API for processing
- Notes are **not stored** on any server or database
- Notes are **not logged** beyond what Anthropic's API does by default
- localStorage is used only for session output — cleared on browser close

**Safe to tell judges:** *"Your notes go to Claude for processing and are immediately discarded. Nothing is stored on our end."*

---

## Known Prototype Limitations

| Risk | Severity | Mitigation |
|---|---|---|
| API key exposed in browser | High (prod) / OK (hackathon) | Move to backend proxy post-hackathon |
| No input sanitization | Low | Notes are text-only, no SQL or HTML injection risk |
| No rate limiting | Low | Single-user prototype, no abuse surface |
| No auth | Low | MVP scope only |

---

## Post-Hackathon Security Roadmap

1. Move Claude API call to a backend (Express / Next.js API route)
2. Add API key to server environment only
3. Add rate limiting per session
4. Add input length validation (max ~10,000 chars)
