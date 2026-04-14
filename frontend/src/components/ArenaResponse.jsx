import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import CodeDiff from './CodeDiff';
import mistralIcon from '../assets/mistral-color.svg';
import cohereIcon from '../assets/cphere-color.svg';

function averageScore(breakdown) {
  if (!breakdown) {
    return 0;
  }

  const total =
    breakdown.correctness +
    breakdown.efficiency +
    breakdown.readability +
    breakdown.completeness;

  return (total / 4).toFixed(1);
}

function metricPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{value}/10</div>
    </div>
  );
}

function SolutionPanel({ title, accentClass, solution, isStreaming, iconSrc, iconAlt }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col transition-all hover:shadow-md">
      <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500 mb-6 flex items-center gap-2">
        <img src={iconSrc} alt={iconAlt} className="w-5 h-5 object-contain" loading="lazy" />
        <span className={`w-2 h-2 rounded-full ${accentClass}`}></span>
        {title}
      </h3>
      <div className="text-zinc-700 dark:text-zinc-300 min-h-[10rem]">
        {solution ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-zinc-900 dark:text-white" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-zinc-900 dark:text-white" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-zinc-900 dark:text-white" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
              a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-500 underline" {...props} />,
              code: ({ node, inline, className, children, ...props }) => {
                return !inline ? (
                  <div className="rounded-xl overflow-hidden my-4 border border-zinc-200 dark:border-zinc-800">
                    <pre className="p-4 bg-zinc-950 overflow-x-auto text-sm text-zinc-100">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {solution}
          </ReactMarkdown>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/40 px-4 py-8 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-3">
              <img src={iconSrc} alt={iconAlt} className="w-6 h-6 object-contain" loading="lazy" />
              <span>{isStreaming ? 'Streaming response...' : 'Waiting for solution...'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArenaResponse({ battle, onRetry }) {
  const { solution1, solution2, judge, status, errorMessage } = battle;

  useEffect(() => {
    hljs.highlightAll();
  }, [solution1, solution2]);

  const winnerLabel = judge?.winner === 'solution_1' ? 'Solution 1' : judge?.winner === 'solution_2' ? 'Solution 2' : 'Pending';

  return (
    <div className="flex flex-col gap-8 my-8 px-4 w-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {status === 'streaming' && 'Streaming'}
            {status === 'judging' && 'Judging'}
            {status === 'complete' && 'Complete'}
            {status === 'error' && 'Failed'}
          </span>
          {judge?.winner_explanation && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Winner: {winnerLabel}</span>
          )}
        </div>
        {status === 'error' && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Retry
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SolutionPanel
          title="Mistral"
          accentClass="bg-emerald-500"
          solution={solution1}
          isStreaming={status === 'streaming' || status === 'judging'}
          iconSrc={mistralIcon}
          iconAlt="Mistral icon"
        />
        <SolutionPanel
          title="Cohere"
          accentClass="bg-violet-500"
          solution={solution2}
          isStreaming={status === 'streaming' || status === 'judging'}
          iconSrc={cohereIcon}
          iconAlt="Cohere icon"
        />
      </div>

      {solution1 && solution2 && (
        <CodeDiff leftText={solution1} rightText={solution2} leftLabel="Solution 1" rightLabel="Solution 2" />
      )}

      {judge && (
        <div className="mt-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                ⚖️ Judge Recommendations
              </h3>
              <div className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                Winner: {winnerLabel}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {judge.winner_explanation}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white dark:bg-zinc-900 px-5 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">Solution 1 Total</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{averageScore(judge.solution_1)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {metricPill({ label: 'Correctness', value: judge.solution_1.correctness })}
                {metricPill({ label: 'Efficiency', value: judge.solution_1.efficiency })}
                {metricPill({ label: 'Readability', value: judge.solution_1.readability })}
                {metricPill({ label: 'Completeness', value: judge.solution_1.completeness })}
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed px-2">
                {judge.solution_1.notes}
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white dark:bg-zinc-900 px-5 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">Solution 2 Total</span>
                <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">{averageScore(judge.solution_2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {metricPill({ label: 'Correctness', value: judge.solution_2.correctness })}
                {metricPill({ label: 'Efficiency', value: judge.solution_2.efficiency })}
                {metricPill({ label: 'Readability', value: judge.solution_2.readability })}
                {metricPill({ label: 'Completeness', value: judge.solution_2.completeness })}
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed px-2">
                {judge.solution_2.notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
