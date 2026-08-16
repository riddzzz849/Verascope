
import { base44 } from '@/api/base44Client';

const REPORT_SCHEMA = {
  type: 'object',
  properties: {
    overall_state: {
      type: 'string',
      enum: ['well_supported', 'partially_supported', 'conflicting', 'poorly_supported', 'insufficient', 'outdated'],
    },
    overall_summary: { type: 'string' },
    confidence: { type: 'number' },
    why_assessment: { type: 'array', items: { type: 'string' } },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          claim_text: { type: 'string' },
          state: { type: 'string' },
          state_summary: { type: 'string' },
          category: { type: 'string' },
        },
      },
    },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          url: { type: 'string' },
          domain: { type: 'string' },
          type: { type: 'string' },
          tier: { type: 'number' },
          published_date: { type: 'string' },
          updated_date: { type: 'string' },
          excerpt: { type: 'string' },
          relationship: { type: 'string' },
          why_rated: { type: 'string' },
        },
      },
    },
    evidence: {
      type: 'object',
      properties: {
        supporting: { type: 'array', items: { type: 'object', properties: { source_id: { type: 'number' }, excerpt: { type: 'string' }, relationship: { type: 'string' } } } },
        contradicting: { type: 'array', items: { type: 'object', properties: { source_id: { type: 'number' }, excerpt: { type: 'string' }, relationship: { type: 'string' } } } },
        context: { type: 'array', items: { type: 'object', properties: { source_id: { type: 'number' }, excerpt: { type: 'string' }, relationship: { type: 'string' } } } },
        unresolved: { type: 'array', items: { type: 'object', properties: { source_id: { type: 'number' }, excerpt: { type: 'string' }, relationship: { type: 'string' } } } },
      },
    },
    conflicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          source_a: { type: 'object', properties: { source_id: { type: 'number' }, quote: { type: 'string' }, date: { type: 'string' } } },
          source_b: { type: 'object', properties: { source_id: { type: 'number' }, quote: { type: 'string' }, date: { type: 'string' } } },
        },
      },
    },
    timeline: {
      type: 'array',
      items: { type: 'object', properties: { date: { type: 'string' }, value: { type: 'string' }, source_id: { type: 'number' } } },
    },
    freshness: {
      type: 'object',
      properties: { state: { type: 'string' }, newest_source_date: { type: 'string' }, note: { type: 'string' } },
    },
    limitations: { type: 'array', items: { type: 'string' } },
    in_simple_terms: { type: 'string' },
    what_you_should_do: { type: 'string' },
    source_quality: {
      type: 'object',
      properties: { tier1_count: { type: 'number' }, tier2_count: { type: 'number' }, tier3_count: { type: 'number' }, notes: { type: 'string' } },
    },
  },
  required: ['overall_state', 'overall_summary', 'confidence', 'why_assessment', 'claims', 'sources', 'evidence', 'in_simple_terms', 'what_you_should_do'],
};

function buildPrompt({ input_type, text, url, image_url }) {
  let inputDescription = '';
  if (input_type === 'text' || input_type === 'quick') {
    inputDescription = `The user submitted the following text to verify:\n\n"""${text}"""`;
  } else if (input_type === 'url') {
    inputDescription = `The user submitted the following URL to verify. Fetch and analyze the content at this URL, then verify the claims it makes:\n\nURL: ${url}`;
  } else if (input_type === 'image') {
    inputDescription = `The user uploaded an image (attached). Read the text visible in the image using OCR, then verify the claims it contains.`;
  }

  return `You are Verascope, an evidence-based information verification system. Your job is NOT to declare claims "true" or "false." Your job is to gather evidence from credible sources, weigh it transparently, and produce a reasoned, auditable assessment the user can verify line by line.

${inputDescription}

Perform the following pipeline:
1. Parse the input into atomic claims (one verifiable assertion each). For a single short sentence, treat it as one claim.
2. Extract entities: people, organizations, places, dates, numbers, currencies.
3. Classify the primary category (health, government, finance, education, legal, emergency, news, sports, technology, other).
4. Generate search queries and retrieve real, credible sources from the web.
5. For each source, extract the specific passage relevant to the claim (verbatim).
6. Compare each claim against the evidence. Flag agreement, contradiction, partial support, or silence.
7. Check freshness of the evidence.
8. Detect genuine conflicts between credible sources â€” never silently pick a winner.
9. Produce a reliability assessment per claim and one overall assessment.
10. Generate a plain-language "why", a plain-language summary, and a "what you should do" recommendation.

ANTI-HALLUCINATION CONTRACT (non-negotiable):
- Only include sources you ACTUALLY found via web search. Never invent URLs, titles, domains, or excerpts.
- Excerpts must be verbatim substrings from the actual source content. Never paraphrase into something the source did not say.
- Only show a publication date if you actually found it. If unknown, set published_date to null.
- If you cannot find real, usable evidence, set overall_state to "insufficient" and DO NOT fill in a plausible-sounding assessment from prior knowledge.
- Every source must have a real, dereferenceable URL.

STATUS VALUES and their meaning:
- "well_supported": Multiple independent high-tier sources agree; no unresolved contradictions.
- "partially_supported": Core claim confirmed but a specific detail (amount, date, scope) is unconfirmed or altered.
- "conflicting": Two or more credible sources disagree and you cannot resolve which is current/correct.
- "poorly_supported": Available evidence contradicts the claim, or the claim's origin has no identifiable credible source.
- "insufficient": Not enough retrievable evidence exists to judge either way.
- "outdated": Evidence exists but predates a likely change (policy/price/schedule that updates periodically).

SOURCE TIERS:
- Tier 1: Government domains, regulatory bodies, universities, official institutions, original research, official company/org statements.
- Tier 2: Reputable news organizations with editorial standards, established research bodies, professional publications.
- Tier 3: Unverified blogs, anonymous pages, social media posts, content farms. Never auto-label tier 3 as false.

For each source, assign a unique numeric id (starting at 1), and fill why_rated with concrete checkable reasons (e.g. "Domain is a registered government domain", "Author identifiable", "No identifiable publisher found").

For evidence arrays, reference sources by their source_id and include the verbatim excerpt and relationship (Supports / Contradicts / Partially supports / Related context / Not directly relevant).

If two or more Tier 1-2 sources disagree, add an entry to conflicts with both quotes and dates, and force that claim's state to "conflicting".

BANNED PHRASES: "definitely true", "fake", "X% chance this is true", "confirmed false". Use instead: "strongly supported by available evidence", "the available evidence does not support this claim", "not currently supported by any identifiable source".

Return only the JSON object matching the schema.`;
}

export async function runVerification(input) {
  const prompt = buildPrompt(input);
  const params = {
    prompt,
    add_context_from_internet: true,
    model: 'gemini_3_flash',
    response_json_schema: REPORT_SCHEMA,
  };
  if (input.input_type === 'image' && input.image_url) {
    params.file_urls = [input.image_url];
  }
  const result = await base44.integrations.Core.InvokeLLM(params);
  return result;
}

