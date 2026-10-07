import { CurrencyMode } from '../types/data';

const CURRENCY_RATES: Record<CurrencyMode, { symbol: string; rate: number; locale: string }> = {
  BRL: { symbol: 'R$', rate: 1.0, locale: 'pt-BR' },
  USD: { symbol: '$', rate: 0.19, locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.175, locale: 'de-DE' },
};

export function formatCurrency(valueInBRL: number, mode: CurrencyMode = 'BRL', compact = false): string {
  const cfg = CURRENCY_RATES[mode] || CURRENCY_RATES.BRL;
  const converted = valueInBRL * cfg.rate;

  if (compact && Math.abs(converted) >= 1_000_000) {
    return `${cfg.symbol} ${(converted / 1_000_000).toLocaleString(cfg.locale, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}M`;
  }
  if (compact && Math.abs(converted) >= 1_000) {
    return `${cfg.symbol} ${(converted / 1_000).toLocaleString(cfg.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`;
  }

  return new Intl.NumberFormat(cfg.locale, {
    style: 'currency',
    currency: mode,
    maximumFractionDigits: 0,
  }).format(converted);
}

export function formatNumber(val: number, decimals = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatPercent(val: number, decimals = 1): string {
  return `${val.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`;
}

export function formatDate(dateString: string): string {
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
}
