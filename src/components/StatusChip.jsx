
import { getStatusConfig, CHIP_CLASSES } from '@/lib/statusConfig';
import { cn } from '@/lib/utils';

export default function StatusChip({ state, size = 'md', showDescription = false, className }) {
  const cfg = getStatusConfig(state);
  const Icon = cfg.icon;
  const sizes = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  };
  const iconSizes = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      <span
        className={cn(
          'inline-flex items-center rounded-full font-semibold tabular-nums w-fit',
          CHIP_CLASSES[cfg.color],
          sizes[size]
        )}
      >
        <Icon className={iconSizes[size]} aria-hidden="true" />
        {cfg.label}
      </span>
      {showDescription && (
        <p className="text-sm text-muted-foreground measure">{cfg.description}</p>
      )}
    </div>
  );
}

