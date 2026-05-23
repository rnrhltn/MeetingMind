/**
 * LoadingSkeleton — Pulsing placeholder shown while the Claude API processes.
 * Mimics the shape of OutputTabs so the layout doesn't shift when results appear.
 */

/** Single pulsing bar */
function Bar({ w = 'w-full', h = 'h-3' }) {
  return <div className={`${h} ${w} rounded-full bg-slate-700/80`} />;
}

/** Pulsing card row (mimics a decision/action item) */
function CardRow({ w = 'w-3/4' }) {
  return (
    <div className="flex gap-3 items-center p-3 rounded-lg bg-slate-900/40 border border-slate-700/30">
      <div className="w-6 h-6 rounded-full bg-slate-700/80 flex-shrink-0" />
      <Bar w={w} />
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl flex flex-col animate-pulse">

      {/* Tab bar skeleton */}
      <div className="flex items-center gap-4 px-5 py-4 bg-slate-900/40 border-b border-slate-700/50">
        {['w-16', 'w-20', 'w-24', 'w-20', 'w-20'].map((w, i) => (
          <div key={i} className={`h-2.5 ${w} rounded-full bg-slate-700/80`} />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="p-6 flex flex-col gap-4">

        {/* Section label */}
        <Bar w="w-14" h="h-2" />

        {/* Summary block */}
        <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-slate-900/40 border border-slate-700/30">
          <Bar w="w-full" />
          <Bar w="w-5/6" />
          <Bar w="w-4/6" />
        </div>

        {/* Decision / action item rows */}
        <CardRow w="w-4/5" />
        <CardRow w="w-3/4" />
        <CardRow w="w-5/6" />

        {/* Spacer rows */}
        <div className="flex flex-col gap-2 pt-1">
          <Bar w="w-full" h="h-2.5" />
          <Bar w="w-2/3"  h="h-2.5" />
        </div>

        {/* Attendee-style rows */}
        <CardRow w="w-1/2" />
        <CardRow w="w-2/3" />
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-700/50 bg-slate-900/30">
        <div className="h-7 w-24 rounded-lg bg-slate-700/80" />
        <div className="h-7 w-32 rounded-lg bg-slate-700/80" />
      </div>
    </div>
  );
}
