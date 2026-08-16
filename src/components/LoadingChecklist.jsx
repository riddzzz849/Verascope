
import { useEffect, useState } from 'react';
import { Check, Loader2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  'Extracting claims',
  'Identifying entities',
  'Searching authoritative sources',
  'Comparing evidence',
  'Checking source freshness',
  'Preparing assessment',
];

export default function LoadingChecklist({ done }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (done) {
      setCurrent(STEPS.length);
      return;
    }
    if (current >= STEPS.length - 1) return;
    const t = setTimeout(() => setCurrent((c) => c + 1), 2200);
    return () => clearTimeout(t);
  }, [current, done]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
      <div className="flex items-center gap-3 mb-5">
        <Loader2 className="h-5 w-5 animate-spin text-brand-accent" />
        <h3 className="text-lg font-semibold">Investigating your claimâ€¦</h3>
      </div>
      <ol className="space-y-3" role="list" aria-live="polite" aria-label="Verification progress">
        {STEPS.map((step, i) => {
          const isDone = i < current || done;
          const isActive = i === current && !done;
          return (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span className="flex h-5 w-5 items-center justify-center shrink-0">
                {isDone ? (
                  <Check className="h-4 w-4 text-status-supported" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 animate-spin text-brand-accent" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/40" />
                )}
              </span>
              <span className={cn(isDone ? 'text-foreground' : isActive ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                {step}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-xs text-muted-foreground">Every assessment links back to its sources. Nothing here is invented.</p>
    </div>
  );
}

