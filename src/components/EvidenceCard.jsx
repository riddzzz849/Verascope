
import { useState } from 'react';
import { ExternalLink, ChevronDown, Building2, Newspaper, GraduationCap, Landmark, MessageCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_ICONS = {
  Government: Landmark,
  News: Newspaper,
  Academic: GraduationCap,
  Organization: Building2,
  'Social post': MessageCircle,
  Unknown: HelpCircle,
};

const TIER_LABELS = {
  1: 'Tier 1 Â· Primary',
  2: 'Tier 2 Â· Established',
  3: 'Tier 3 Â· Low authority',
};

const RELATIONSHIP_STYLES = {
  Supports: 'text-status-supported',
  Contradicts: 'text-status-poor',
  'Partially supports': 'text-status-partial',
  'Related context': 'text-status-outdated',
  'Not directly relevant': 'text-muted-foreground',
};

export default function EvidenceCard({ source, excerpt, relationship, number }) {
  const [expanded, setExpanded] = useState(false);
  if (!source) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          Source could not be retrieved.
        </div>
      </div>
    );
  }
  const TypeIcon = TYPE_ICONS[source.type] || HelpCircle;
  const rel = relationship || source.relationship;
  const exc = excerpt || source.excerpt;
  const tier = TIER_LABELS[source.tier] || 'Unclassified';

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {number != null && (
              <span className="text-xs font-semibold text-muted-foreground tabular-nums">[{number}]</span>
            )}
            <h4 className="font-semibold text-foreground truncate">{source.name || source.domain}</h4>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <TypeIcon className="h-3.5 w-3.5" /> {source.type || 'Unknown'}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" /> {tier}
            </span>
            {source.domain && <span className="truncate">{source.domain}</span>}
          </div>
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
        >
          View <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {source.published_date ? (
          <span>Published: <span className="text-foreground font-medium">{source.published_date}</span></span>
        ) : (
          <span>Publication date not identified</span>
        )}
        {source.updated_date && source.updated_date !== source.published_date && (
          <span>Updated: <span className="text-foreground font-medium">{source.updated_date}</span></span>
        )}
        {rel && (
          <span className={cn('font-semibold', RELATIONSHIP_STYLES[rel] || 'text-foreground')}>{rel}</span>
        )}
      </div>

      {exc && (
        <blockquote className="mt-3 border-l-2 border-border pl-3 text-sm text-foreground italic measure">
          â€œ{exc}â€
        </blockquote>
      )}

      {source.why_rated && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-accent hover:underline"
          aria-expanded={expanded}
        >
          Why this source is rated this way
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
        </button>
      )}
      {expanded && source.why_rated && (
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed measure">{source.why_rated}</p>
      )}
    </article>
  );
}

