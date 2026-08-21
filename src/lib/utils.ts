import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number, currency: string = 'BRL') {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency,
  });
}
