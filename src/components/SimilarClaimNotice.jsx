
import { ArrowRight, RefreshCw } from 'lucide-react';
import StatusChip from '@/components/StatusChip';

export default function SimilarClaimNotice({ match, onView, onAnyway }) {
  const { record, score } = match;
  const pct = Math.round(score * 100);
  return (
    <div className="rounded-2xl border border-status-outdated/30 bg-status-outdated-tint p-6 shadow-card">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background text-brand-accent">
          <RefreshCw className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-semibold">We checked something very similar recently</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        A claim matching yours ({pct}% similar) was verified on{' '}
        {new Date(record.created_date).toLocaleDateString()}. You can view that report or verify yours fresh.
      </p>
      <blockquote className="mt-3 rounded-lg border border-border bg-background p-3 text-sm text-foreground italic measure">
        â€œ{record.input_text}â€
      </blockquote>
      <div className="mt-3">
        <StatusChip state={record.overall_state} size="sm" />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={onView}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-brand-navy/90"
        >
          View that report <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={onAnyway}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
        >
          Verify mine anyway
        </button>
      </div>
    </div>
  );
}

