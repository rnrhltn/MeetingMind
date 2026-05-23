import { useState } from 'react';
import { processMeetingNotes } from './lib/claude';
import InputPanel from './components/InputPanel';
import OutputTabs from './components/OutputTabs';
import MeetingHistory from './components/MeetingHistory';
import { useHistory } from './hooks/useHistory';

/**
 * App.jsx — Root component that wires everything together.
 * State: output, loading, error, sidebarOpen
 * History: persisted to localStorage via useHistory hook
 */
export default function App() {
  const [output, setOutput]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { history, save, remove } = useHistory();

  const handleSubmit = async (notes) => {
    setLoading(true);
    setError(null);
    try {
      const result = await processMeetingNotes(notes);
      if (!result) {
        setError('Something went wrong. Check your API key in .env and try again.');
      } else {
        setOutput(result);
        save(result);
      }
    } catch (err) {
      // Show the real Anthropic error message when available
      setError(err.message || 'Unexpected error. Check the browser console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setOutput(null);
    setError(null);
  };

  /** Load a history entry back into the output panel */
  const handleLoadHistory = (entry) => {
    setOutput(entry.output);
    setError(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">

      {/* ── Navbar ── */}
      <nav className="flex-shrink-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Left: history toggle + logo */}
          <div className="flex items-center gap-3">
            <button
              id="sidebar-toggle-btn"
              onClick={() => setSidebarOpen((v) => !v)}
              title={sidebarOpen ? 'Collapse history' : 'Show history'}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-all duration-150 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span className="hidden sm:inline">History</span>
            </button>

            <img src="/logo.png" alt="MeetingMind Logo" className="h-8 w-auto" />
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-teal-600/20 text-teal-400 border border-teal-500/30 font-medium">
              Beta
            </span>
          </div>

          {/* Right: tagline + Start Over */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-400">
              AI meeting assistant for student orgs
            </span>
            {output && (
              <button
                id="start-over-btn"
                onClick={handleStartOver}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-150 font-medium"
              >
                ↩ Start Over
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex-shrink-0 bg-red-900/40 border-b border-red-500/30 text-red-300 text-sm px-6 py-3 text-center">
          ⚠️ {error}
        </div>
      )}

      {/* ── Body: sidebar + scrollable main ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* History sidebar */}
        <MeetingHistory
          isOpen={sidebarOpen}
          history={history}
          onLoad={handleLoadHistory}
          onDelete={remove}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

            {!output ? (
              /* Landing state — InputPanel centered */
              <div className="flex flex-col items-center gap-8">
                {/* Hero */}
                <div className="text-center max-w-2xl">
                  <img src="/logo.png" alt="MeetingMind" className="h-24 w-auto mx-auto mb-4 drop-shadow-lg" />
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
                    Turn messy notes into
                    <span className="bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent"> structured outputs </span>
                    in seconds
                  </h1>
                  <p className="mt-3 text-slate-400 text-sm sm:text-base">
                    Paste any meeting notes → get a summary, decisions log, action items, and channel-ready comms. Powered by Claude AI.
                  </p>
                </div>

                {/* Input */}
                <div className="w-full max-w-2xl">
                  <InputPanel onSubmit={handleSubmit} isLoading={loading} />
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center gap-2">
                  {['📋 Meeting Summary', '⚖️ Decisions Log', '✅ Action Items', '📡 Channel Comms', '⬇ PDF Export'].map((feat) => (
                    <span key={feat} className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              /* Results state — two-column layout */
              <div className="fade-in grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="lg:sticky lg:top-8">
                  <InputPanel onSubmit={handleSubmit} isLoading={loading} />
                </div>
                <OutputTabs output={output} />
              </div>
            )}

          </div>

          {/* Footer */}
          <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-600">
            Built by <span className="text-slate-500">Rainier M. Holaton</span> · Build with AI Asia Pacific College · May 2026
          </footer>
        </main>

      </div>
    </div>
  );
}
