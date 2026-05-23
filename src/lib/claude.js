/**
 * claude.js — MeetingMind AI Integration
 *
 * Exports processMeetingNotes(rawNotes) which calls the Anthropic Claude API
 * and returns a structured JSON object parsed from the response.
 *
 * Based on prompt design from docs/PROMPT.md
 */

// Route through Vite proxy (/api/anthropic → https://api.anthropic.com)
// This avoids CORS errors when calling the Anthropic API from the browser.
const ANTHROPIC_API_URL = '/api/anthropic/v1/messages';
const MODEL = 'claude-3-5-sonnet-20241022';

// System prompt engineered for Filipino student orgs (see docs/PROMPT.md)
const SYSTEM_PROMPT = `You are a meeting intelligence assistant built specifically for Filipino student organizations.

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
6. For attendees: look for explicit attendance lists ("present:", "absent:", "attendees:") OR
   infer presence from context (e.g. someone who spoke, was assigned a task, or is mentioned
   as doing something in the meeting is likely present). Mark as "absent" only if explicitly
   stated. If attendance cannot be determined at all, return an empty array.

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
  },
  "attendees": [
    {
      "name": "Person's full name or nickname as written in the notes",
      "status": "present"
    },
    {
      "name": "Person explicitly noted as absent",
      "status": "absent"
    }
  ]
}`;

/**
 * Processes raw meeting notes through the Claude API.
 * @param {string} rawNotes - Raw, unstructured meeting notes from the user.
 * @returns {Promise<object|null>} Parsed JSON output, or null on failure.
 */
export async function processMeetingNotes(rawNotes) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'sk-ant-xxxxxxxxxxxxxxxx') {
    console.error('MeetingMind: VITE_ANTHROPIC_API_KEY is not set in your .env file.');
    return null;
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2560,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Here are the raw meeting notes. Process them now:\n\n---\n${rawNotes}\n---`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('MeetingMind: API error', response.status, errorBody);
      // Try to extract a human-readable message from Anthropic's error body
      let message = `API error ${response.status}`;
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed?.error?.message) message = parsed.error.message;
      } catch { /* ignore parse failure */ }
      throw new Error(message);
    }

    const data = await response.json();

    // Extract the text content from the response
    const rawText = data?.content?.[0]?.text;
    if (!rawText) {
      console.error('MeetingMind: Empty response from Claude API');
      return null;
    }

    // Parse the JSON — Claude is instructed to return raw JSON only
    const parsed = JSON.parse(rawText);
    return parsed;

  } catch (err) {
    console.error('MeetingMind: Failed to process notes:', err);
    throw err;
  }
}
