
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Swords, CircleDashed, Layers, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import StatusChip from '@/components/StatusChip';

export default function Dashboard() {
  const [records, setRecords] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Verification.list('-created_date', 50);
        setRecords(list);
      } catch {
        setRecords([]);
      }
    })();
  }, []);

  if (!records) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <div className="h-8 w-8 mx-auto border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  const total = records.length;
  const well = records.filter((r) => r.overall_state === 'well_supported').length;
  const needs = records.filter((r) => ['partially_supported', 'outdated'].includes(r.overall_state)).length;
  const conflict = records.filter((r) => r.overall_state === 'conflicting').length;
  const insuff = records.filter((r) => r.overall_state === 'insufficient').length;

  const tiles = [
    { label: 'Total checks', value: total, icon: Layers, color: 'text-foreground' },
    { label: 'Well supported', value: well, icon: CheckCircle2, color: 'text-status-supported' },
    { label: 'Needs verification', value: needs, icon: AlertTriangle, color: 'text-status-partial' },
    { label: 'Conflicting', value: conflict, icon: Swords, color: 'text-status-conflict' },
    { label: 'Insufficient', value: insuff, icon: CircleDashed, color: 'text-status-insufficient' },
  ];

  const avgSources = total > 0 ? Math.round(records.reduce((a, r) => a + (r.source_count || 0), 0) / total) : 0;
  const categories = {};
  records.forEach((r) => { if (r.category) categories[r.category] = (categories[r.category] || 0) + 1; });
  const topCats = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Your activity</h1>
      <p className="mt-1 text-muted-foreground">A transparent record of every claim youâ€™ve checked.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <Icon className={`h-5 w-5 ${t.color}`} />
              <p className="mt-3 text-2xl font-bold tabular-nums">{t.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Recent verifications</h2>
          {records.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">No verifications yet.</p>
              <Link to="/" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent hover:underline">
                Verify your first claim <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {records.map((r) => (
                <Link
                  key={r.id}
                  to={`/report/${r.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-card-hover transition-shadow"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{r.input_text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(r.created_date).toLocaleDateString()} Â· {r.source_count || 0} sources
                    </p>
                  </div>
                  <StatusChip state={r.overall_state} size="sm" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Trends</h2>
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div>
              <p className="text-2xl font-bold tabular-nums">{total}</p>
              <p className="text-xs text-muted-foreground">Checks total</p>
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{avgSources}</p>
              <p className="text-xs text-muted-foreground">Avg sources per check</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Most common categories</p>
              {topCats.length === 0 ? (
                <p className="text-xs text-muted-foreground">None yet</p>
              ) : (
                <div className="space-y-1.5">
                  {topCats.map(([cat, count]) => (
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
      </div>
    </div>
  );
}

