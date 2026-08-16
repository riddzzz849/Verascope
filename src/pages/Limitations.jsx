
const LIMITATIONS = [
  'Ambiguous claims that can be read multiple ways.',
  'Satire and parody, which may look like sincere assertions.',
  'Breaking news that is still developing â€” the evidence trail may be incomplete.',
  'Claims with no public evidence trail, such as private conversations or DM-only content.',
  'Poor-quality scans or images where text cannot be reliably read.',
  'Genuine disagreement among authoritative sources, which we surface rather than resolve.',
  'Rapidly-changing information â€” prices, schedules, weather â€” that may shift between verification and your reading.',
];

export default function Limitations() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Limitations</h1>
        <p className="mt-3 text-muted-foreground text-lg">A system that admits its edges is more trustworthy than one that claims to have none.</p>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <p className="text-foreground measure">
          Verascope is an information-verification aid. It works best on factual claims that have a public evidence trail. Here is where it currently struggles:
        </p>
        <ul className="mt-5 space-y-3">
          {LIMITATIONS.map((l, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-status-conflict" />
              <span className="text-foreground measure">{l}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-xl border border-status-conflict/30 bg-status-conflict-tint p-5">
        <p className="text-sm text-foreground">
          <strong>Important:</strong> Verascope is not professional advice. For decisions affecting your health, finances, legal standing, or safety, consult a qualified professional or the relevant official authority directly.
        </p>
      </div>
    </div>
  );
}

