import { useState } from 'react';

/**
 * InputPanel — Notes textarea and submit trigger.
 * Props:
 *   onSubmit(notes) — called when user clicks Process Notes
 *   isLoading       — bool, true while API call is in progress
 */
const SAMPLE_NOTES = `org meeting nov 12
present: raine, kuya jeff, ate bea, marco, jd, patch

talked about the christmas party
- venue: either covered court or audio visual room
- jeff said covered court is free on dec 14, AV room needs reservation fee
- DECIDED: covered court on dec 14, jeff will confirm with SSG by friday
- budget is 3500 pesos total, bea is handling the liquidation

sponsorship update
- marco reached out to 3 local businesses, only 1 replied (Chowking Katipunan)
- they can give 500 worth of GCs if we put their tarpaulin at the event
- DECIDED: accept the sponsorship, patch will finalize the MOA by nov 15
- marco to follow up with the other 2 businesses this week

events committee
- jd presented the program flow
- DECIDED: raine + bea as emcees, jd to send final program by nov 18

reminders
- attendance low, 3 members missed last 2 meetings
- jeff will send reminder to whole org
- next meeting: nov 19 same time`;

export default function InputPanel({ onSubmit, isLoading }) {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim() || isLoading) return;
    onSubmit(notes);
  };

  const handleTrySample = () => {
    setNotes(SAMPLE_NOTES);
  };

  return (
    <div className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <span className="text-teal-400">✦</span>
          Paste Your Meeting Notes
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Any format — Zoom chat, voice transcript, bullet points, Taglish
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
        {/* Try a sample */}
        {!notes.trim() && !isLoading && (
          <div className="flex justify-end">
            <button
              id="try-sample-btn"
              type="button"
              onClick={handleTrySample}
              className="text-xs px-3 py-1.5 rounded-lg border border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400 transition-all duration-150 font-medium"
            >
              ✨ Try a sample
            </button>
          </div>
        )}
        <textarea
          id="meeting-notes-input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isLoading}
          placeholder={"Paste your meeting notes here — any format works.\nZoom chat, voice-to-text, bullet points, anything."}
          rows={10}
          className="w-full resize-none rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm leading-relaxed px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 disabled:opacity-50"
          style={{ minHeight: '220px' }}
        />

        {/* Character count */}
        {notes.length > 0 && (
          <p className="text-xs text-slate-500 -mt-2 text-right">
            {notes.length.toLocaleString()} characters
          </p>
        )}

        {/* Submit */}
        <button
          id="process-notes-btn"
          type="submit"
          disabled={!notes.trim() || isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-white
            bg-gradient-to-r from-teal-600 to-teal-500
            hover:from-teal-500 hover:to-teal-400
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200 shadow-lg shadow-teal-900/30
            focus:outline-none focus:ring-2 focus:ring-teal-400/50"
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Processing…
            </>
          ) : (
            <>
              <span>⚡</span>
              Process Notes
            </>
          )}
        </button>

        {/* Privacy note */}
        <p className="text-center text-xs text-slate-500">
          🔒 Your notes are never stored or shared.
        </p>
      </form>
    </div>
  );
}
