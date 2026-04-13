import React from 'react';

function extractCodeBlock(text) {
  if (!text) {
    return '';
  }

  const match = text.match(/```[\w-]*\n([\s\S]*?)```/);

  if (match?.[1]) {
    return match[1].trimEnd();
  }

  return text.trimEnd();
}

function buildRows(leftText, rightText) {
  const leftLines = extractCodeBlock(leftText).split('\n');
  const rightLines = extractCodeBlock(rightText).split('\n');
  const rowCount = Math.max(leftLines.length, rightLines.length);

  return Array.from({ length: rowCount }, (_, index) => {
    const left = leftLines[index] ?? '';
    const right = rightLines[index] ?? '';
    let status = 'equal';

    if (left !== right) {
      if (left && right) {
        status = 'change';
      } else if (left) {
        status = 'remove';
      } else {
        status = 'add';
      }
    }

    return {
      left,
      right,
      lineNumber: index + 1,
      status,
    };
  });
}

function rowClasses(status, side) {
  if (status === 'equal') {
    return 'bg-zinc-950/70 text-zinc-100';
  }

  if (status === 'change') {
    return side === 'left'
      ? 'bg-red-500/10 text-red-100 border-red-500/20'
      : 'bg-emerald-500/10 text-emerald-100 border-emerald-500/20';
  }

  if (status === 'remove') {
    return side === 'left'
      ? 'bg-red-500/15 text-red-100 border-red-500/30'
      : 'bg-zinc-950/40 text-zinc-500';
  }

  return side === 'right'
    ? 'bg-emerald-500/15 text-emerald-100 border-emerald-500/30'
    : 'bg-zinc-950/40 text-zinc-500';
}

function DiffLine({ lineNumber, text, status, side }) {
  return (
    <div className={`grid grid-cols-[3rem_1fr] gap-3 border-b border-white/5 px-3 py-1.5 ${rowClasses(status, side)}`}>
      <span className="text-right text-[11px] font-mono text-current/60 select-none">
        {lineNumber}
      </span>
      <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words text-[13px] leading-6 font-mono">
        {text || '\u00A0'}
      </pre>
    </div>
  );
}

export default function CodeDiff({ leftText, rightText, leftLabel = 'Solution 1', rightLabel = 'Solution 2' }) {
  const rows = buildRows(leftText, rightText);

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-5 py-4 bg-zinc-50 dark:bg-zinc-950/60">
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Side-by-side Code Diff</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Highlighted lines show where the solutions diverge.</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            Removed
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            Added
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 bg-zinc-950">
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 border-b border-white/5">
            {leftLabel}
          </div>
          <div>
            {rows.map((row) => (
              <DiffLine key={`left-${row.lineNumber}`} lineNumber={row.lineNumber} text={row.left} status={row.status} side="left" />
            ))}
          </div>
        </div>

        <div className="bg-zinc-950">
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 border-b border-white/5">
            {rightLabel}
          </div>
          <div>
            {rows.map((row) => (
              <DiffLine key={`right-${row.lineNumber}`} lineNumber={row.lineNumber} text={row.right} status={row.status} side="right" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
