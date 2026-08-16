
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import VerificationComposer from '@/components/VerificationComposer';
import LoadingChecklist from '@/components/LoadingChecklist';
import SimilarClaimNotice from '@/components/SimilarClaimNotice';
import { runVerification } from '@/lib/verify';
import { jaccardSimilarity } from '@/lib/similarity';
import { DEMO_CLAIMS } from '@/lib/demoClaims';
import { base44 } from '@/api/base44Client';

const STEPS = [
  { num: '01', title: 'Submit', body: 'Paste text, drop a screenshot, or paste a link.' },
  { num: '02', title: 'Investigate', body: 'Verascope searches, ranks, and compares evidence from credible sources â€” live, in front of you.' },
  { num: '03', title: 'Understand', body: 'Get a reliability report with every source cited and clickable.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [similarMatch, setSimilarMatch] = useState(null);

  const runVerificationFlow = async (input) => {
    setLoading(true);
    setSimilarMatch(null);
    try {
      const report = await runVerification(input);
      const rec = await base44.entities.Verification.create({
        input_text: input.text || input.url || 'Image verification',
        input_type: input.input_type,
        overall_state: report.overall_state,
        overall_summary: report.overall_summary || '',
        confidence: report.confidence ?? 0,
        source_count: (report.sources || []).length,
        category: report.claims?.[0]?.category || 'general',
        report_data: report,
      });
      navigate(`/report/${rec.id}`);
    } catch (e) {
      setLoading(false);
      alert('Verification failed. Please try again.');
    }
  };

  const handleVerify = async (input) => {
    const inputText = input.text || input.url || '';
    if (inputText) {
      try {
        const recent = await base44.entities.Verification.list('-created_date', 30);
        let best = null, bestScore = 0;
        for (const r of recent) {
          if (!r.input_text) continue;
          const score = jaccardSimilarity(inputText, r.input_text);
          if (score > bestScore) { bestScore = score; best = r; }
        }
        if (best && bestScore >= 0.55) {
          const ageDays = (Date.now() - new Date(best.created_date).getTime()) / 86400000;
          if (ageDays <= 7) {
            setSimilarMatch({ record: best, score: bestScore, input });
            return;
          }
        }
      } catch {}
    }
    runVerificationFlow(input);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1200px] px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-supported" />
              Evidence-based verification Â· We show our work
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Look closer before you believe it.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground text-balance">
              Verascope checks claims against credible evidence and shows you exactly what it found â€” so you decide, not the algorithm.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            {loading ? (
              <LoadingChecklist done={false} />
            ) : similarMatch ? (
              <SimilarClaimNotice
                match={similarMatch}
                onView={() => navigate(`/report/${similarMatch.record.id}`)}
                onAnyway={() => {
                  const input = similarMatch.input;
                  setSimilarMatch(null);
                  runVerificationFlow(input);
                }}
              />
            ) : (
              <VerificationComposer onSubmit={handleVerify} loading={loading} />
            )}
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Every assessment links back to its sources. Nothing here is invented.
            </p>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Built on a transparent methodology</h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              No fabricated testimonials or vanity metrics. Instead, our entire process is documented and auditable.
            </p>
            <a href="/methodology" className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand-accent hover:underline">
              Read the methodology <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">How it works</h2>
          <p className="mt-2 text-muted-foreground">Three steps from suspicion to clarity.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.num} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="text-3xl font-bold text-brand-accent tabular-nums">{s.num}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo claims */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Try it now</h2>
            <p className="mt-2 text-muted-foreground">Six pre-built claims spanning different outcomes â€” explore with zero typing.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_CLAIMS.map((c, i) => (
              <button
                key={i}
                onClick={() => handleVerify({ input_type: c.input_type, text: c.text })}
                disabled={loading}
                className="group flex flex-col gap-2 rounded-xl border border-border bg-background p-5 text-left shadow-card transition-all hover:shadow-card-hover hover:border-brand-accent/40 disabled:opacity-50"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</span>
                <span className="text-sm text-foreground leading-snug line-clamp-3">â€œ{c.text}â€</span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-accent">
                  Verify this <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

