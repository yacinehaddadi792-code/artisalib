import clsx from 'clsx';

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export function formatCurrency(cents?: number | null) {
  if (typeof cents !== 'number') return 'Sur devis';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(cents / 100);
}

export function initials(firstName?: string | null, lastName?: string | null) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}
