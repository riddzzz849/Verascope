
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Palette, Shield, Info, Trash2, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ThemeToggle from '@/components/ThemeToggle';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try { setUser(await base44.auth.me()); } catch { setUser(null); }
    })();
  }, []);

  const deleteAllHistory = async () => {
    if (!confirm('Delete all your verification history? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await base44.entities.Verification.deleteMany({});
      navigate('/dashboard');
    } catch {
      alert('Could not delete history. Try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>

      <div className="mt-8 space-y-6">
        {/* Account */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-brand-accent" />
            <h2 className="text-lg font-semibold">Account</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium text-foreground">{user?.full_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{user?.email || 'â€”'}</p>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-brand-accent" />
            <h2 className="text-lg font-semibold">Preferences</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark appearance.</p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        {/* Privacy */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-brand-accent" />
            <h2 className="text-lg font-semibold">Privacy & data</h2>
          </div>
          <p className="text-sm text-muted-foreground measure mb-4">
            Screenshots and raw pasted text are processed for verification and not retained beyond the reportâ€™s derived data unless you save the report. You can delete your history at any time.
          </p>
          <button
            onClick={deleteAllHistory}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg border border-status-poor/40 bg-status-poor-tint px-4 py-2 text-sm font-medium text-status-poor hover:opacity-90 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> {deleting ? 'Deletingâ€¦' : 'Delete all history'}
          </button>
        </section>

        {/* About */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-brand-accent" />
            <h2 className="text-lg font-semibold">About</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <a href="/methodology" className="inline-flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-accent">
              Source methodology <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/limitations" className="inline-flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-accent">
              Limitations <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

