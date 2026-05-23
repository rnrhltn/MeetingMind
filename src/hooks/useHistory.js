/**
 * useHistory — localStorage-backed meeting history hook.
 *
 * Storage schema: each entry is stored under "mm_history_{timestamp}"
 * Value shape: { timestamp: number, output: { summary, decisions, actionItems, comms } }
 */

import { useState, useCallback } from 'react';

const KEY_PREFIX = 'mm_history_';

/** Read and sort all history entries from localStorage (newest first). */
function readAll() {
  const items = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(KEY_PREFIX)) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key));
        if (parsed?.timestamp && parsed?.output) {
          items.push({ key, ...parsed });
        }
      } catch {
        // Skip corrupted entries silently
      }
    }
  }
  return items.sort((a, b) => b.timestamp - a.timestamp);
}

export function useHistory() {
  const [history, setHistory] = useState(() => readAll());

  /** Persist a new output to localStorage and refresh state. */
  const save = useCallback((output) => {
    const timestamp = Date.now();
    const key = `${KEY_PREFIX}${timestamp}`;
    localStorage.setItem(key, JSON.stringify({ timestamp, output }));
    setHistory(readAll());
    return key;
  }, []);

  /** Remove a single entry by key and refresh state. */
  const remove = useCallback((key) => {
    localStorage.removeItem(key);
    setHistory(readAll());
  }, []);

  return { history, save, remove };
}
