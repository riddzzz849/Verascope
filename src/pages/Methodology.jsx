
const SECTIONS = [
  { title: 'Claim extraction', body: 'We split your input into atomic claims â€” one verifiable assertion each â€” so each can be assessed independently. If a split is ambiguous, we show it and let you override.' },
  { title: 'Source discovery', body: 'We generate search queries per claim and retrieve candidate sources, ranked by authority, relevance, recency, and directness. Near-identical syndicated stories are deduplicated to one origin.' },
  { title: 'Authority scoring', body: 'Sources are tiered: Tier 1 (government, regulatory, universities, official statements), Tier 2 (reputable news, established research bodies), Tier 3 (unverified blogs, social posts). Tier 3 is never auto-labeled false.' },
  { title: 'Evidence agreement', body: 'We extract the verbatim passage from each source relevant to the claim and compare them, flagging agreement, contradiction, partial support, or silence.' },
  { title: 'Freshness', body: 'We distinguish published, updated, retrieved, event, and expiry dates. Freshness is judged per-category â€” a policy ages differently than breaking news.' },
  { title: 'Conflict handling', body: 'When two or more credible sources disagree, we never silently pick a winner. We show both side-by-side and set the assessment to Conflicting Evidence.' },
  { title: 'Final assessment', body: 'We combine everything into one of six reliability states, each with a plain-language explanation. We do not determine absolute truth â€” we assess how strongly currently available evidence supports a claim.' },
];

export default function Methodology() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Source methodology</h1>
        <p className="mt-3 text-muted-foreground text-lg">How Verascope gathers, weighs, and presents evidence.</p>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <p className="text-foreground measure">
          <strong>Core principle:</strong> We do not determine absolute truth. We assess how strongly currently available evidence supports a claim. Every assessment links back to real, retrieved sources â€” nothing is invented.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {SECTIONS.map((s, i) => (
          <div key={s.title} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-primary-foreground tabular-nums">{i + 1}</span>
            <div>
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-1 text-muted-foreground leading-relaxed measure">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { tier: 'Tier 1', label: 'Primary / Authoritative', body: 'Government, regulatory bodies, universities, official statements, original research.' },
          { tier: 'Tier 2', label: 'Established Secondary', body: 'Reputable news organizations, established research bodies, professional publications.' },
          { tier: 'Tier 3', label: 'Low authority', body: 'Unverified blogs, anonymous pages, social posts. Treated as a lead, not confirmation.' },
        ].map((t) => (
          <div key={t.tier} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-bold text-brand-accent">{t.tier}</p>
            <p className="mt-1 font-semibold">{t.label}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

