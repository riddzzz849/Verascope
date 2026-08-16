
import { Link } from 'react-router-dom';
import { LogOut, User as UserIcon, Pencil, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const name = user?.full_name || user?.email || 'User';
  const initials = name.split(' ').map((s) => s[0] || '').join('').slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-primary-foreground text-xs font-semibold ring-offset-background hover:ring-2 hover:ring-ring transition-all"
          aria-label="Open profile menu"
        >
          {initials || <UserIcon className="h-4 w-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-medium truncate">{user?.full_name || 'User'}</span>
          {user?.email && <span className="text-xs text-muted-foreground truncate font-normal">{user.email}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings"><UserIcon className="mr-2 h-4 w-4" /> My Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings"><Pencil className="mr-2 h-4 w-4" /> Edit Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings"><SettingsIcon className="mr-2 h-4 w-4" /> Account</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-status-poor focus:text-status-poor" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

