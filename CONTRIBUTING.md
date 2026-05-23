# Contributing

> This is a hackathon project. Keep it simple and ship fast.

---

## Ground Rules

1. **One feature per branch** — branch off `main`, name it `feat/your-feature`
2. **No over-engineering** — MVP first, polish later
3. **Test in browser before pushing** — we have no CI in this sprint
4. **Commit messages** — use plain English: `add action items tab`, `fix copy button`

---

## Branch Strategy

```
main
├── feat/input-panel
├── feat/output-tabs
├── feat/claude-integration
├── feat/pdf-export
└── fix/api-error-handling
```

---

## Task Ownership (Hackathon Sprint)

| Task | Owner | Est. Time |
|---|---|---|
| Project scaffold (Vite + Tailwind) | — | 30 min |
| InputPanel component | — | 45 min |
| Claude API integration (`claude.js`) | — | 1 hr |
| OutputTabs + Summary view | — | 45 min |
| Action Items component | — | 30 min |
| Channel Comms + copy buttons | — | 30 min |
| PDF export | — | 45 min |
| UI polish + mobile responsiveness | — | 1 hr |
| README + docs | — | 30 min |
| Demo prep + pitch | — | 1 hr |

---

## How to Submit a Change

```bash
git checkout -b feat/your-feature
# make your changes
git add .
git commit -m "brief description of what you did"
git push origin feat/your-feature
# open a pull request to main
```

---

## Code Style

- Functional React components only (no class components)
- Tailwind for all styling — no custom CSS files
- `async/await` for all API calls — no `.then()` chains
- Keep components under 100 lines — split if longer
