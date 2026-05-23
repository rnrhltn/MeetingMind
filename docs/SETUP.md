# Setup Guide

> Get MeetingMind running locally in under 5 minutes.

---

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- An Anthropic API key → [Get one here](https://console.anthropic.com)

---

## Step-by-Step

### 1. Clone the repository

```bash
git clone https://github.com/your-org/meetingmind.git
cd meetingmind
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your key:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173).

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | Yes | Your Anthropic Claude API key |

---

## Common Issues

**"API key not found" error**
→ Make sure your `.env` file exists and the key starts with `sk-ant-`

**Blank output after submitting notes**
→ Check the browser console for API errors. Most likely a missing or invalid API key.

**Port 5173 already in use**
→ Run `npm run dev -- --port 3000` to use a different port.

---

## Build for Production

```bash
npm run build
npm run preview
```
