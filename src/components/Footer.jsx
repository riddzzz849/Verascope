
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Navbar';

const LINKS = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/methodology', label: 'Source Methodology' },
  { to: '/limitations', label: 'Limitations' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/settings', label: 'Settings' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">Evidence before belief. We show our work â€” every assessment links back to its sources.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>Verascope is an information-verification aid, not professional advice. We do not determine absolute truth â€” we assess how strongly currently available evidence supports a claim.</p>
        </div>
      </div>
    </footer>
  );
}

