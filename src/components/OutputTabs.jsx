import { useState } from 'react';
import { jsPDF } from 'jspdf';
import ActionItems from './ActionItems';
import ChannelComms from './ChannelComms';
import Attendance from './Attendance';

/**
 * OutputTabs — 4-tab view for Summary, Decisions, Action Items, and Comms.
 * Props:
 *   output — { summary, decisions, actionItems, comms }
 */

const TABS = [
  { id: 'summary',     label: '📋 Summary' },
  { id: 'decisions',   label: '⚖️ Decisions' },
  { id: 'actionItems', label: '✅ Action Items' },
  { id: 'comms',       label: '📡 Comms' },
  { id: 'attendance',  label: '👥 Attendance' },
];

/** Reusable inline Copy button — flashes "Copied!" for 1.5s */
function CopyButton({ getText, id, label = '📋 Copy' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = typeof getText === 'function' ? getText() : getText;
    navigator.clipboard.writeText(text || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleCopy}
      className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-150 font-medium flex-shrink-0"
    >
      {copied ? '✓ Copied!' : label}
    </button>
  );
}

export default function OutputTabs({ output }) {
  const [activeTab, setActiveTab] = useState('summary');

  if (!output) return null;

  // --- Build plain-text version of each tab for clipboard + PDF ---
  const getTabText = (tabId) => {
    switch (tabId) {
      case 'summary':
        return output.summary || '';
      case 'decisions':
        return (output.decisions || []).map((d, i) => `${i + 1}. ${d}`).join('\n');
      case 'actionItems':
        return (output.actionItems || [])
          .map((item) =>
            `[ ] ${item.task}${item.owner ? ` — ${item.owner}` : ''}${item.due ? ` (Due: ${item.due})` : ''}`
          )
          .join('\n');
      case 'comms': {
        const c = output.comms || {};
        return `GC:\n${c.gc || ''}\n\nEmail:\n${c.email || ''}\n\nPost:\n${c.post || ''}`;
      }
      case 'attendance': {
        const att = output.attendees || [];
        const present = att.filter((a) => a.status === 'present');
        const absent  = att.filter((a) => a.status === 'absent');
        return [
          `Attendance: ${present.length} of ${att.length} present`,
          '',
          'PRESENT:',
          ...present.map((a) => `  ✓ ${a.name}`),
          ...(absent.length ? ['', 'ABSENT:', ...absent.map((a) => `  ✗ ${a.name}`)] : []),
        ].join('\n');
      }
      default:
        return '';
    }
  };

  // --- Full structured plain-text export (all sections) ---
  const getAllText = () => {
    const c = output.comms || {};
    const decisions = (output.decisions || [])
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const actionItems = (output.actionItems || [])
      .map((item) =>
        `- ${item.task}${item.owner ? ` — ${item.owner}` : ''}${item.due ? ` (Due: ${item.due})` : ''}`
      )
      .join('\n');

    return [
      '=== MEETING SUMMARY ===',
      output.summary || '',
      '',
      '=== DECISIONS ===',
      decisions || '(none)',
      '',
      '=== ACTION ITEMS ===',
      actionItems || '(none)',
      '',
      '=== COMMS ===',
      `[GC] ${c.gc || ''}`,
      '',
      `[EMAIL] ${c.email || ''}`,
      '',
      `[POST] ${c.post || ''}`,
      '',
      '=== ATTENDANCE ===',
      getTabText('attendance') || '(none)',
    ].join('\n');
  };

  // --- PDF export — full structured output ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const text = getAllText();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Header
    doc.setFontSize(18);
    doc.setTextColor(13, 148, 136);
    doc.text('MeetingMind', margin, 20);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated ${new Date().toLocaleString()}`, margin, 28);

    // Body — section headers bold, content normal
    const bodyLines = text.split('\n');
    let y = 38;
    const lineHeight = 5.5;

    bodyLines.forEach((line) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      if (line.startsWith('===')) {
        doc.setFontSize(10);
        doc.setTextColor(13, 148, 136);
        doc.setFont(undefined, 'bold');
        doc.text(line, margin, y);
        doc.setFont(undefined, 'normal');
      } else {
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const wrapped = doc.splitTextToSize(line || ' ', maxWidth);
        doc.text(wrapped, margin, y);
        y += (wrapped.length - 1) * lineHeight;
      }
      y += lineHeight;
    });

    doc.save(`meetingmind-${dateStr}.pdf`);
  };

  return (
    <div className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl flex flex-col">

      {/* Tab bar */}
      <div className="flex border-b border-slate-700/50 bg-slate-900/40 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-3.5 text-xs font-semibold transition-all duration-200 border-b-2 whitespace-nowrap
              ${activeTab === tab.id
                ? 'border-teal-500 text-teal-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content — each tab has its own Copy button top-right */}
      <div className="flex-1 p-6 overflow-y-auto fade-in" key={activeTab}>

        {/* ── Summary ── */}
        {activeTab === 'summary' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Overview</span>
              <CopyButton id="copy-summary-btn" getText={() => getTabText('summary')} />
            </div>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/40 rounded-xl p-4 border border-slate-700/40">
              {output.summary || <span className="text-slate-500 italic">No summary generated.</span>}
            </p>
          </div>
        )}

        {/* ── Decisions ── */}
        {activeTab === 'decisions' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {(output.decisions || []).length} decision{(output.decisions || []).length !== 1 ? 's' : ''}
              </span>
              <CopyButton id="copy-decisions-btn" getText={() => getTabText('decisions')} />
            </div>
            <ol className="flex flex-col gap-2">
              {(output.decisions || []).length === 0 ? (
                <p className="text-sm text-slate-500 italic">No decisions found.</p>
              ) : (
                output.decisions.map((decision, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-slate-200 leading-relaxed p-3 rounded-lg bg-slate-900/40 border border-slate-700/40"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600/20 text-teal-400 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {decision}
                  </li>
                ))
              )}
            </ol>
          </div>
        )}

        {/* ── Action Items ── */}
        {activeTab === 'actionItems' && (
          <ActionItems items={output.actionItems} />
        )}

        {/* ── Comms ── */}
        {activeTab === 'comms' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Channel Drafts</span>
              <CopyButton id="copy-comms-btn" getText={() => getTabText('comms')} />
            </div>
            <ChannelComms comms={output.comms} />
          </div>
        )}

        {/* ── Attendance ── */}
        {activeTab === 'attendance' && (
          <Attendance attendees={output.attendees} />
        )}

      </div>

      {/* Footer — Copy all + Download PDF */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-700/50 bg-slate-900/30">
        <CopyButton
          id="copy-all-btn"
          getText={getAllText}
          label="Copy all"
        />
        <button
          id="download-pdf-btn"
          onClick={handleDownloadPDF}
          className="text-xs px-3 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 hover:text-teal-200 border border-teal-500/30 transition-all duration-150 font-medium"
        >
          ⬇ Download PDF
        </button>
      </div>
    </div>
  );
}
