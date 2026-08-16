
import { useState, useRef } from 'react';
import { Type, Link as LinkIcon, Image as ImageIcon, Zap, Paperclip, Trash2, ClipboardPaste, Loader2, FileText, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

const TABS = [
  { id: 'text', label: 'Text', icon: Type },
  { id: 'url', label: 'URL', icon: LinkIcon },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'quick', label: 'Quick Claim', icon: Zap },
];

const MAX_CHARS = 3000;

export default function VerificationComposer({ onSubmit, loading, initial }) {
  const [tab, setTab] = useState(initial?.input_type || 'text');
  const [text, setText] = useState(initial?.text || '');
  const [url, setUrl] = useState(initial?.url || '');
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '');
  const [imagePreview, setImagePreview] = useState(initial?.image_url || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { listening, supported: voiceSupported, toggle: toggleVoice } = useSpeechRecognition({
    onResult: (t) => setText((prev) => (prev ? prev + ' ' + t : t)),
  });

  const handleFile = async (file) => {
    setError('');
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
      setImagePreview(file_url);
      setTab('image');
    } catch {
      setError('Could not upload the image. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const canSubmit = () => {
    if (loading || uploading) return false;
    if (tab === 'text' || tab === 'quick') return text.trim().length > 0;
    if (tab === 'url') return url.trim().length > 0;
    if (tab === 'image') return !!imageUrl;
    return false;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;
    let payload = { input_type: tab };
    if (tab === 'text' || tab === 'quick') payload.text = text.trim();
    if (tab === 'url') payload.url = url.trim();
    if (tab === 'image') { payload.image_url = imageUrl; payload.text = 'Image verification'; }
    onSubmit(payload);
  };

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (tab === 'url') setUrl(clip);
      else setText((t) => (t ? t + '\n' + clip : clip));
    } catch {
      setError('Clipboard access was blocked.');
    }
  };

  const handleClear = () => {
    setText('');
    setUrl('');
    setImageUrl('');
    setImagePreview('');
    setError('');
  };

  const charCount = text.length;
  const multiClaimHint = tab === 'text' && charCount > 400;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card-hover p-4 sm:p-6">
      <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1" role="tablist">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors min-w-[88px]',
                active ? 'bg-background text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {(tab === 'text' || tab === 'quick') && (
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              placeholder={tab === 'quick' ? 'Type a single factual claim to verify quicklyâ€¦' : 'Paste a claim, message, or paragraphâ€¦'}
              rows={tab === 'quick' ? 2 : 5}
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>{multiClaimHint && 'This looks like more than one claim â€” weâ€™ll break it down.'}</span>
              <span className="tabular-nums">{charCount}/{MAX_CHARS}</span>
            </div>
          </div>
        )}

        {tab === 'url' && (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        )}

        {tab === 'image' && (
          <div>
            {imagePreview ? (
              <div className="relative rounded-xl border border-border overflow-hidden">
                <img src={imagePreview} alt="Uploaded screenshot for verification" className="w-full max-h-64 object-contain bg-muted" />
                <button
                  onClick={() => { setImageUrl(''); setImagePreview(''); }}
                  className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-lg bg-background/90 px-2 py-1 text-xs font-medium shadow-card hover:bg-background"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 px-4 py-10 cursor-pointer hover:border-brand-accent transition-colors"
              >
                {uploading ? <Loader2 className="h-6 w-6 animate-spin text-brand-accent" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                <p className="text-sm text-foreground font-medium">{uploading ? 'Uploadingâ€¦' : 'Drop a screenshot or click to upload'}</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, or PDF Â· up to 10MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {voiceSupported && (
            <button onClick={toggleVoice} className={cn('inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors', listening ? 'bg-status-conflict-tint text-status-conflict' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>
              <Mic className="h-3.5 w-3.5" /> {listening ? 'Listeningâ€¦' : 'Voice'}
            </button>
          )}
          <button onClick={handlePaste} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <ClipboardPaste className="h-3.5 w-3.5" /> Paste
          </button>
          <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Paperclip className="h-3.5 w-3.5" /> Attach image
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all',
            canSubmit()
              ? 'bg-brand-navy text-primary-foreground hover:bg-brand-navy/90 shadow-card'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          {loading ? 'Verifyingâ€¦' : 'Verify'}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-status-poor">{error}</p>}
      {!canSubmit() && !loading && !error && (
        <p className="mt-2 text-xs text-muted-foreground">Enter a claim, link, or image to start verification.</p>
      )}
    </div>
  );
}

