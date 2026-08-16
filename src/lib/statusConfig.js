
import { CheckCircle2, AlertTriangle, Swords, XCircle, CircleDashed, Clock } from 'lucide-react';

export const STATUS_CONFIG = {
  well_supported: {
    label: 'Well Supported',
    icon: CheckCircle2,
    color: 'supported',
    description: 'Multiple independent, high-tier sources agree; no unresolved contradictions.',
  },
  partially_supported: {
    label: 'Partially Supported',
    icon: AlertTriangle,
    color: 'partial',
    description: 'Core claim confirmed; a specific detail is unconfirmed or altered.',
  },
  conflicting: {
    label: 'Conflicting Evidence',
    icon: Swords,
    color: 'conflict',
    description: 'Two or more credible sources disagree and the system cannot resolve which is current.',
  },
  poorly_supported: {
    label: 'Poorly Supported',
    icon: XCircle,
    color: 'poor',
    description: 'Available evidence contradicts the claim, or no identifiable credible source exists.',
  },
  insufficient: {
    label: 'Insufficient Evidence',
    icon: CircleDashed,
    color: 'insufficient',
    description: 'Not enough retrievable evidence exists to form a judgment either way.',
  },
  outdated: {
    label: 'Outdated / Needs Reverification',
    icon: Clock,
    color: 'outdated',
    description: 'Evidence exists but predates a likely change.',
  },
};

export const CHIP_CLASSES = {
  supported: 'bg-status-supported-tint text-status-supported',
  partial: 'bg-status-partial-tint text-status-partial',
  conflict: 'bg-status-conflict-tint text-status-conflict',
  poor: 'bg-status-poor-tint text-status-poor',
  insufficient: 'bg-status-insufficient-tint text-status-insufficient',
  outdated: 'bg-status-outdated-tint text-status-outdated',
};

export const DOT_CLASSES = {
  supported: 'bg-status-supported',
  partial: 'bg-status-partial',
  conflict: 'bg-status-conflict',
  poor: 'bg-status-poor',
  insufficient: 'bg-status-insufficient',
  outdated: 'bg-status-outdated',
};

export function getStatusConfig(state) {
  return STATUS_CONFIG[state] || STATUS_CONFIG.insufficient;
}

export const HIGH_STAKES_CATEGORIES = ['medical', 'health', 'legal', 'financial', 'finance', 'emergency', 'safety'];

