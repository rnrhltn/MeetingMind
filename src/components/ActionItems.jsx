import { useState } from 'react';

/**
 * ActionItems — Renders a card list of action items with owner badges.
 * Props:
 *   items — array of { task: string, owner: string|null, due: string|null }
 */
export default function ActionItems({ items }) {
  const [copied, setCopied] = useState(false);

  const copyAllAsChecklist = () => {
    if (!items?.length) return;
    const text = items
      .map(
        (item) =>
          `[ ] ${item.task}${item.owner ? ` — ${item.owner}` : ''}${item.due ? ` (Due: ${item.due})` : ''}`
      )
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  if (!items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
        <span className="text-3xl">✅</span>
        <p className="text-sm">No action items found in these notes.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{items.length} task{items.length !== 1 ? 's' : ''} found</p>
        <button
          id="copy-checklist-btn"
          onClick={copyAllAsChecklist}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-150 font-medium"
        >
          {copied ? '✓ Copied!' : '📋 Copy all as checklist'}
        </button>
      </div>

      {/* Task cards */}
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-200"
        >
          {/* Checkbox */}
          <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 border-slate-600 bg-slate-800" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-100 leading-snug">{item.task}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {item.owner && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-600/20 text-teal-300 border border-teal-500/30">
                  👤 {item.owner}
                </span>
              )}
              {item.due && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {item.due}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
