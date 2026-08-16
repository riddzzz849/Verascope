
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import ProfileMenu from '@/components/ProfileMenu';
import { cn } from '@/lib/utils';

const LINKS = [
  { to: '/', label: 'Verify' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/trending', label: 'Trending' },
  { to: '/dashboard', label: 'Dashboard' },
];

export function Logo({ className }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2', className)} aria-label="Verascope home">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-brand-accent" aria-hidden="true">
        <circle cx="14" cy="14" r="12.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 2.5 L14 14 L25.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 10 L14 14 L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="font-heading text-lg font-bold tracking-tight text-foreground">Verascope</span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === l.to ? 'text-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="ml-2"><ThemeToggle /></div>
          <ProfileMenu />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ProfileMenu />
          <ThemeToggle />
          <button onClick={() => setOpen((v) => !v)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-accent" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col px-4 py-2">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium',
                  pathname === l.to ? 'text-foreground bg-accent' : 'text-muted-foreground'
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/settings" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground">
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

