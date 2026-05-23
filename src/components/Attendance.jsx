/**
 * Attendance — Renders the attendee list with present/absent badges.
 *
 * Props:
 *   attendees — array of { name: string, status: "present" | "absent" }
 */

import { useState } from 'react';

export default function Attendance({ attendees }) {
  const [copied, setCopied] = useState(false);

  const list = attendees || [];
  const present = list.filter((a) => a.status === 'present');
  const absent  = list.filter((a) => a.status === 'absent');

  const handleCopy = () => {
    if (!list.length) return;
    const lines = [
      `Attendance — ${present.length} of ${list.length} present`,
      '',
      'PRESENT:',
      ...present.map((a) => `  ✓ ${a.name}`),
      ...(absent.length ? ['', 'ABSENT:', ...absent.map((a) => `  ✗ ${a.name}`)] : []),
    ].join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  if (!list.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
        <span className="text-3xl">👥</span>
        <p className="text-sm">No attendees found in these notes.</p>
        <p className="text-xs text-slate-600">
          Make sure the notes mention who was present.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Summary line + copy button */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          <span className="text-teal-400 font-bold">{present.length}</span>
          <span className="text-slate-500"> of {list.length} member{list.length !== 1 ? 's' : ''} attended</span>
        </p>
        <button
          id="copy-attendance-btn"
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-150 font-medium"
        >
          {copied ? '✓ Copied!' : '📋 Copy attendance list'}
        </button>
      </div>

      {/* Attendance progress bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-500"
          style={{ width: `${list.length ? (present.length / list.length) * 100 : 0}%` }}
        />
      </div>

      {/* Attendee list */}
      <ul className="flex flex-col gap-2">
        {list.map((attendee, i) => {
          const isPresent = attendee.status === 'present';
          return (
            <li
              key={i}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/40 hover:border-slate-600/50 transition-colors duration-150"
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${isPresent ? 'bg-teal-600/20 text-teal-400' : 'bg-red-500/10 text-red-400'}`}
                >
                  {attendee.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-200 font-medium">{attendee.name}</span>
              </div>

              {/* Status badge */}
              {isPresent ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-600/15 text-teal-400 border border-teal-500/25">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Present
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Absent
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
