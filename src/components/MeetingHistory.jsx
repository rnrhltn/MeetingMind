/**
 * MeetingHistory — Collapsible left sidebar listing past meetings.
 *
 * Props:
 *   isOpen   — boolean, controls sidebar width
 *   history  — array of { key, timestamp, output }
 *   onLoad   — (entry) => void  — loads a past meeting into output panel
 *   onDelete — (key) => void    — removes an entry from localStorage
 */

/** Format timestamp → "May 23, 2026" */
function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Format timestamp → "1:45 PM" */
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Grab the first sentence of summary, capped at 72 chars. */
function getPreview(summary) {
  if (!summary) return 'No summary available.';
  const sentence = summary.split(/(?<=[.!?])\s/)[0] ?? summary;
  return sentence.length > 72 ? sentence.slice(0, 72) + '…' : sentence;
}

/** Trash SVG icon */
function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

export default function MeetingHistory({ isOpen, history, onLoad, onDelete }) {
  return (
    <aside
      style={{ width: isOpen ? '240px' : '0px' }}
      className="flex-shrink-0 flex flex-col border-r border-slate-700/50 bg-slate-900/80 backdrop-blur-sm transition-all duration-300 overflow-hidden"
    >
      {/* Inner wrapper — keeps content from wrapping during collapse */}
      <div className="w-[240px] flex flex-col h-full">

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between flex-shrink-0">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            History
          </span>
          <span className="text-xs text-slate-500">
            {history.length} meeting{history.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {history.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-slate-500 leading-relaxed">
                No past meetings yet.
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Processed notes will appear here.
              </p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.key}
                className="group relative mx-2 mb-1 rounded-lg hover:bg-slate-800/60 transition-colors duration-150 cursor-pointer"
              >
                {/* Clickable area — loads output */}
                <button
                  id={`history-item-${entry.key}`}
                  onClick={() => onLoad(entry)}
                  className="w-full text-left px-3 py-2.5 pr-8"
                >
                  <p className="text-xs font-semibold text-slate-300 truncate">
                    {formatDate(entry.timestamp)}
                  </p>
                  <p className="text-[10px] text-slate-500 mb-1">
                    {formatTime(entry.timestamp)}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {getPreview(entry.output?.summary)}
                  </p>
                </button>

                {/* Trash button — appears on hover */}
                <button
                  id={`delete-history-${entry.key}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.key);
                  }}
                  title="Delete this meeting"
                  className="absolute top-2 right-2 p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all duration-150"
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        {history.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-800 flex-shrink-0">
            <p className="text-[10px] text-slate-600 text-center">
              Stored in your browser
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
