
import { Link } from 'react-router-dom';
import { ClipboardPaste, Search, FileCheck2, ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: ClipboardPaste, title: '01 â€” Submit', body: 'Paste a claim, drop a screenshot, or paste a link. You can also type a single quick claim for a fast check. Verascope parses your input into raw text â€” OCR for images, page extraction for URLs.' },
  { icon: Search, title: '02 â€” Investigate', body: 'Verascope splits your input into atomic claims, extracts entities, classifies the category, and searches credible sources ranked by authority, relevance, recency, and directness. Near-identical syndicated stories count as one origin, not many.' },
  { icon: FileCheck2, title: '03 â€” Understand', body: 'You get a reliability report: every claim assessed, every source cited and clickable, conflicts surfaced side-by-side, freshness checked, and a plain-language summary with a practical recommendation.' },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">How it works</h1>
        <p className="mt-3 text-muted-foreground text-lg">Submit, investigate, understand â€” then decide for yourself.</p>
      </div>

      <div className="mt-10 space-y-6">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-status-outdated-tint text-brand-accent">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="mt-1.5 text-muted-foreground leading-relaxed measure">{s.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-2xl border border-brand-accent/30 bg-status-outdated-tint p-6 text-center">
        <h2 className="text-xl font-semibold">Ready to verify something?</h2>
        <p className="mt-1.5 text-muted-foreground">Paste a claim and see the evidence for yourself.</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-navy px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-brand-navy/90">
          Start verifying <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

