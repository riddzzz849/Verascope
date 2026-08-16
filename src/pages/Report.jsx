
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Copy, Share2, Printer, ThumbsUp, ThumbsDown, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import StatusChip from '@/components/StatusChip';
import EvidenceCard from '@/components/EvidenceCard';
import LoadingChecklist from '@/components/LoadingChecklist';
import { runVerification } from '@/lib/verify';
import { getStatusConfig, HIGH_STAKES_CATEGORIES } from '@/lib/statusConfig';
import { cn } from '@/lib/utils';

const EVIDENCE_GROUPS = [
  { key: 'supporting', label: 'Supporting' },
  { key: 'contradicting', label: 'Contradicting' },
  { key: 'context', label: 'Context / Related' },
  { key: 'unresolved', label: 'Unresolved' },
];

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rechecking, setRechecking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rec = await base44.entities.Verification.get(id);
        if (active) setRecord(rec);
      } catch {
        if (active) setRecord(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const report = record?.report_data;
  const getSource = (sid) => report?.sources?.find((s) => s.id === sid);

  const handleRecheck = async () => {
    if (!record) return;
    setRechecking(true);
    try {
      const input = { input_type: record.input_type };
      if (record.input_type === 'url') input.url = record.input_text;
      else if (record.input_type === 'image') { input.image_url = record.report_data?.image_url; input.text = record.input_text; }
      else input.text = record.input_text;
      const newReport = await runVerification(input);
      const rec = await base44.entities.Verification.create({
        input_text: record.input_text,
        input_type: record.input_type,
        overall_state: newReport.overall_state,
        overall_summary: newReport.overall_summary || '',
        confidence: newReport.confidence ?? 0,
        source_count: (newReport.sources || []).length,
        category: newReport.claims?.[0]?.category || record.category || 'general',
        report_data: newReport,
      });
      navigate(`/report/${rec.id}`);
    } catch {
      setRechecking(false);
      alert('Re-check failed. Please try again.');
    }
  };

  const copySummary = () => {
    const text = `${record.input_text}\n\nAssessment: ${getStatusConfig(report?.overall_state).label}\n${report?.overall_summary || ''}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReport = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <LoadingChecklist done={false} />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Report not found</h1>
        <p className="mt-2 text-muted-foreground">This verification may have been deleted.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-brand-accent font-medium hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Verify
        </Link>
      </div>
    );
  }

  if (rechecking) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <LoadingChecklist done={false} />
      </div>
    );
  }

  const state = report?.overall_state || 'insufficient';
  const cfg = getStatusConfig(state);
  const category = (report?.claims?.[0]?.category || record.category || '').toLowerCase();
  const isHighStakes = HIGH_STAKES_CATEGORIES.some((c) => category.includes(c));

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> New verification
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleRecheck} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            <RefreshCw className="h-3.5 w-3.5" /> Re-check now
          </button>
          <button onClick={copySummary} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy summary'}
          </button>
          <button onClick={shareReport} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            <Printer className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Your claim */}
      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your claim</h2>
        <blockquote className="mt-2 rounded-xl border border-border bg-card p-4 text-foreground measure">
          {record.input_text}
        </blockquote>
      </section>

      {/* High-stakes notice */}
      {isHighStakes && (
        <div className="mt-4 flex gap-3 rounded-xl border border-status-conflict/30 bg-status-conflict-tint p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-status-conflict" />
          <p className="text-sm text-foreground">
            <strong>Important:</strong> This is an information-verification aid, not professional advice. For decisions that affect your health, finances, legal standing, or safety, consult a qualified professional or the relevant official authority directly.
          </p>
        </div>
      )}

      {/* Overall assessment */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overall reliability assessment</h2>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <StatusChip state={state} size="lg" />
          <span className="text-sm text-muted-foreground">Confidence: <span className="font-semibold text-foreground tabular-nums">{Math.round(report?.confidence ?? 0)}/100</span></span>
          <span className="text-sm text-muted-foreground">Sources reviewed: <span className="font-semibold text-foreground tabular-nums">{report?.sources?.length || 0}</span></span>
        </div>
        <p className="mt-3 text-foreground measure">{report?.overall_summary}</p>
        <p className="mt-2 text-xs text-muted-foreground">Last verified: {new Date(record.created_date).toLocaleDateString()}</p>
      </section>

      {/* Why this assessment */}
      {report?.why_assessment?.length > 0 && (
        <Section title="Why this assessment">
          <ul className="space-y-2">
            {report.why_assessment.map((w, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground measure">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                {w}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Claim breakdown */}
      {report?.claims?.length > 1 && (
        <Section title="Claim breakdown">
          <div className="space-y-3">
            {report.claims.map((c, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-foreground measure">{c.claim_text}</p>
                  <StatusChip state={c.state} size="sm" />
                </div>
                {c.state_summary && <p className="mt-2 text-xs text-muted-foreground">{c.state_summary}</p>}
              </div>
            ))}
            <p className="text-xs text-muted-foreground">We read this as {report.claims.length} claims. Click each claim's evidence in the sections below.</p>
          </div>
        </Section>
      )}

      {/* Evidence */}
      {report?.evidence && (
        <Section title="Evidence">
          <div className="space-y-6">
            {EVIDENCE_GROUPS.map((g) => {
              const items = report.evidence[g.key] || [];
              if (items.length === 0) return null;
              return (
                <div key={g.key}>
                  <h3 className="text-sm font-semibold text-foreground mb-3">{g.label} <span className="text-muted-foreground font-normal">({items.length})</span></h3>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {items.map((item, i) => (
                      <EvidenceCard
                        key={i}
                        source={getSource(item.source_id)}
                        excerpt={item.excerpt}
                        relationship={item.relationship}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            {report.evidence.supporting?.length === 0 && report.evidence.contradicting?.length === 0 && (
              <p className="text-sm text-muted-foreground">No specific evidence passages were extracted. See all sources below.</p>
            )}
          </div>
        </Section>
      )}

      {/* Source quality */}
      {report?.source_quality && (
        <Section title="Source quality">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Tier 1 Â· Primary', count: report.source_quality.tier1_count || 0 },
              { label: 'Tier 2 Â· Established', count: report.source_quality.tier2_count || 0 },
              { label: 'Tier 3 Â· Low authority', count: report.source_quality.tier3_count || 0 },
            ].map((t) => (
              <div key={t.label} className="rounded-xl border border-border bg-background p-4">
                <p className="text-2xl font-bold tabular-nums">{t.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.label}</p>
              </div>
            ))}
          </div>
          {report.source_quality.notes && <p className="mt-3 text-sm text-muted-foreground measure">{report.source_quality.notes}</p>}
        </Section>
      )}

      {/* Conflicts */}
      {report?.conflicts?.length > 0 && (
        <Section title="Conflicts">
          <div className="space-y-4">
            {report.conflicts.map((c, i) => (
              <div key={i} className="rounded-xl border border-status-conflict/30 bg-status-conflict-tint p-4">
                <p className="text-sm text-foreground mb-3">{c.description || 'Credible sources currently disagree. We canâ€™t confidently resolve this discrepancy â€” hereâ€™s what each says.'}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[c.source_a, c.source_b].filter(Boolean).map((side, j) => {
                    const src = getSource(side.source_id);
                    return (
                      <div key={j} className="rounded-lg border border-border bg-background p-3">
                        <p className="text-xs font-semibold text-foreground">{src?.name || 'Source'}</p>
                        {side.date && <p className="text-xs text-muted-foreground">{side.date}</p>}
                        <blockquote className="mt-2 text-sm italic text-foreground">â€œ{side.quote}â€</blockquote>
                        {src?.url && <a href={src.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-brand-accent hover:underline">View <ExternalLink className="h-3 w-3" /></a>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Timeline */}
      {report?.timeline?.length > 0 && (
        <Section title="Timeline">
          <ol className="relative border-l border-border pl-6 space-y-4">
            {report.timeline.map((t, i) => {
              const src = getSource(t.source_id);
              return (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-brand-accent" />
                  <p className="text-sm font-semibold text-foreground">{t.date}</p>
                  <p className="text-sm text-muted-foreground">{t.value}</p>
                  {src?.url && <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-accent hover:underline">{src.name}</a>}
                </li>
              );
            })}
          </ol>
        </Section>
      )}

      {/* Freshness */}
      {report?.freshness && (
        <Section title="Freshness check">
          <p className="text-sm text-foreground measure">{report.freshness.note || `Newest available source: ${report.freshness.newest_source_date || 'unknown'}.`}</p>
          {report.freshness.state === 'potentially_outdated' && (
            <p className="mt-2 flex items-center gap-2 text-sm text-status-conflict">
              <Info className="h-4 w-4" /> This kind of information changes often. Confirm with the current official source before acting on it.
            </p>
          )}
        </Section>
      )}

      {/* Limitations */}
      {report?.limitations?.length > 0 && (
        <Section title="Limitations of this report">
          <ul className="space-y-2">
            {report.limitations.map((l, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground measure">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                {l}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* In simple terms */}
      {report?.in_simple_terms && (
        <Section title="In simple terms">
          <p className="text-foreground measure leading-relaxed">{report.in_simple_terms}</p>
        </Section>
      )}

      {/* What you should do */}
      {report?.what_you_should_do && (
        <Section title="What you should do">
          <div className="rounded-xl border border-brand-accent/30 bg-status-outdated-tint p-4">
            <p className="text-sm text-foreground measure">{report.what_you_should_do}</p>
          </div>
        </Section>
      )}

      {/* All sources */}
      {report?.sources?.length > 0 && (
        <Section title="All sources">
          <ol className="space-y-2">
            {report.sources.map((s) => (
              <li key={s.id} id={`source-${s.id}`} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                <span className="text-xs font-semibold text-muted-foreground tabular-nums mt-0.5">[{s.id}]</span>
                <div className="min-w-0 flex-1">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-brand-accent hover:underline inline-flex items-center gap-1">
                    {s.name || s.domain} <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-xs text-muted-foreground">{s.domain} Â· {s.type || 'Unknown'} Â· Tier {s.tier || 'â€”'}{s.published_date ? ` Â· ${s.published_date}` : ''}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Feedback */}
      <Section title="Was this verification useful?">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFeedback('up')}
            className={cn('inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium', feedback === 'up' ? 'border-status-supported bg-status-supported-tint text-status-supported' : 'border-border hover:bg-accent')}
          >
            <ThumbsUp className="h-4 w-4" /> Yes
          </button>
          <button
            onClick={() => setFeedback('down')}
            className={cn('inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium', feedback === 'down' ? 'border-status-poor bg-status-poor-tint text-status-poor' : 'border-border hover:bg-accent')}
          >
            <ThumbsDown className="h-4 w-4" /> No
          </button>
        </div>
        {feedback === 'down' && (
          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium text-foreground mb-2">What was the issue?</p>
            <div className="flex flex-wrap gap-2">
              {['Wrong source', 'Missing evidence', 'Assessment unclear', 'Outdated', 'Other'].map((opt) => (
                <button key={opt} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                  {opt}
                </button>
              ))}
            </div>
            <textarea placeholder="Optional detailsâ€¦" rows={2} className="mt-3 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <p className="mt-2 text-xs text-muted-foreground">Your feedback feeds our internal QA queue.</p>
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
      {children}
    </section>
  );
}

