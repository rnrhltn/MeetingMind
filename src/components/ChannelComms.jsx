import { useState } from 'react';

/**
 * ChannelComms — Three communication drafts: GC, Email, Social Post.
 * Props:
 *   comms — { gc: string, email: string, post: string }
 */

const channels = [
  {
    key: 'gc',
    label: '💬 Group Chat',
    colorClasses: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    badgeClasses: 'bg-amber-500/20 text-amber-300',
  },
  {
    key: 'email',
    label: '📧 Email',
    colorClasses: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    badgeClasses: 'bg-blue-500/20 text-blue-300',
  },
  {
    key: 'post',
    label: '📣 Social Post',
    colorClasses: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    badgeClasses: 'bg-purple-500/20 text-purple-300',
  },
];

function CommCard({ channel, text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 ${channel.colorClasses}`}>
      {/* Card header */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${channel.badgeClasses}`}>
          {channel.label}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-150 font-medium"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {/* Message body */}
      <div className="bg-slate-900/60 rounded-lg px-4 py-3">
        <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
          {text || <span className="text-slate-500 italic">No content generated.</span>}
        </p>
      </div>

      {/* Character count */}
      {text && (
        <p className="text-xs text-slate-500 text-right">
          {text.length.toLocaleString()} characters
        </p>
      )}
    </div>
  );
}

export default function ChannelComms({ comms }) {
  if (!comms) return null;

  return (
    <div className="flex flex-col gap-4">
      {channels.map((channel) => (
        <CommCard key={channel.key} channel={channel} text={comms[channel.key]} />
      ))}
    </div>
  );
}
