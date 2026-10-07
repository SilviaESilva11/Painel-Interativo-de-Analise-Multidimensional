import React from 'react';
import { MetricSummary, CurrencyMode } from '../types/data';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';
import { TrendingUp, DollarSign, Percent, Star, Receipt, Layers } from 'lucide-react';

interface MetricCardsProps {
  metrics: MetricSummary;
  currency: CurrencyMode;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, currency }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* Metric 1: Total Revenue */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-colors">
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Receita Total</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white font-mono tabular-nums tracking-tight">
          {formatCurrency(metrics.totalRevenue, currency)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{formatPercent(metrics.targetAchievement)}</span>
          </div>
          <span>meta: {formatCurrency(metrics.revenueTarget, currency, true)}</span>
        </div>
        {/* Subtle target progress */}
        <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, metrics.targetAchievement)}%` }}
          />
        </div>
      </div>

      {/* Metric 2: Net Profit & Margin */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-colors">
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Lucro Líquido & Margem</span>
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white font-mono tabular-nums tracking-tight">
          {formatCurrency(metrics.totalProfit, currency)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            {formatPercent(metrics.avgMargin)} margem média
          </span>
          <span aria-hidden="true">·</span>
          <span>custo: {formatCurrency(metrics.totalCost, currency, true)}</span>
        </div>
        <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, metrics.avgMargin)}%` }}
          />
        </div>
      </div>

      {/* Metric 3: Volume & Deals */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-colors">
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Volume de Entregas</span>
          <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white font-mono tabular-nums tracking-tight">
          {formatNumber(metrics.totalVolume)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {metrics.totalDeals} contratos
          </span>
          <span aria-hidden="true">·</span>
          <span>unidades/licenças ativas</span>
        </div>
        <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-violet-500 h-full rounded-full transition-all duration-500"
            style={{ width: '78%' }}
          />
        </div>
      </div>

      {/* Metric 4: Average CSAT */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-colors">
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Índice CSAT Médio</span>
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Star className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white font-mono tabular-nums tracking-tight flex items-baseline gap-1">
          <span>{metrics.avgCsat.toFixed(2)}</span>
          <span className="text-xs text-neutral-400 font-normal">/ 5.0</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
          <span className="text-amber-600 dark:text-amber-400 font-semibold">
            {formatPercent((metrics.avgCsat / 5) * 100, 0)} aprovação
          </span>
          <span aria-hidden="true">·</span>
          <span>excelência operacional</span>
        </div>
        <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(metrics.avgCsat / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Metric 5: Average Ticket */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-colors">
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Ticket Médio</span>
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white font-mono tabular-nums tracking-tight">
          {formatCurrency(metrics.avgTicket, currency, true)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">Por transação</span>
          <span aria-hidden="true">·</span>
          <span>contrato médio</span>
        </div>
        <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: '64%' }}
          />
        </div>
      </div>

    </div>
  );
};
