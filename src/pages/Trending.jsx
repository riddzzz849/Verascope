
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import StatusChip from '@/components/StatusChip';
import { cn } from '@/lib/utils';

const WINDOWS = [
  { id: '24h', label: '24 hours' },
  { id: '7d', label: '7 days' },
  { id: 'all', label: 'All time' },
];

export default function Trending() {
  const [records, setRecords] = useState(null);
  const [timeWindow, setTimeWindow] = useState('7d');

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Verification.list('-created_date', 200);
        setRecords(list);
      } catch {
        setRecords([]);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!records) return [];
    const now = Date.now();
    const cutoff = timeWindow === '24h' ? now - 86400000 : timeWindow === '7d' ? now - 7 * 86400000 : 0;
    return records.filter((r) => new Date(r.created_date).getTime() >= cutoff);
  }, [records, timeWindow]);

  const trending = useMemo(() => {
    const groups = {};
    filtered.forEach((r) => {
      const key = (r.input_text || '').toLowerCase().trim().slice(0, 120);
      if (!key) return;
      if (!groups[key]) groups[key] = { text: r.input_text, count: 0, latest: r };
      groups[key].count++;
      if (new Date(r.created_date) > new Date(groups[key].latest.created_date)) groups[key].latest = r;
    });
    return Object.values(groups).sort((a, b) => b.count - a.count).slice(0, 20);
  }, [filtered]);

  const categories = useMemo(() => {
    const c = {};
    filtered.forEach((r) => { if (r.category) c[r.category] = (c[r.category] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-brand-accent" />
          <h1 className="text-2xl font-bold sm:text-3xl">Trending checks</h1>
        </div>
        <p className="text-muted-foreground">Claims verified most frequently across all users â€” aggregated counts only, never tied to individuals.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {WINDOWS.map((w) => (
          <button
            key={w.id}
            onClick={() => setTimeWindow(w.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              timeWindow === w.id ? 'bg-brand-navy text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {w.label}
          </button>
        ))}
      </div>

      {records === null ? (
        <div className="mt-10 h-8 w-8 mx-auto border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      ) : trending.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-card p-8 text-center">
          <Flame className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No checks in this window yet. As more claims are verified, the most common ones will surface here.</p>
          <Link to="/" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent hover:underline">
            Verify a claim <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Whatâ€™s circulating right now</h2>
            {trending.map((t, i) => (
              <Link
                key={i}
                to={`/report/${t.latest.id}`}
                className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-card-hover transition-shadow"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-accent tabular-nums">#{i + 1}</span>
                    <span className="text-xs text-muted-foreground">{t.count} check{t.count !== 1 ? 's' : ''}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground line-clamp-2">{t.text}</p>
                </div>
                <StatusChip state={t.latest.overall_state} size="sm" />
              </Link>
            ))}
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Categories</h2>
            <div className="rounded-xl border border-border bg-card p-5">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No category data yet.</p>
              ) : (
                <div className="space-y-2">
                  {categories.map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-muted-foreground">{cat}</span>
                      <span className="font-semibold tabular-nums">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

