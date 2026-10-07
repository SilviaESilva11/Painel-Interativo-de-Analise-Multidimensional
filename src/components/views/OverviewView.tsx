import React, { useState } from 'react';
import { DataRecord, MetricSummary, CurrencyMode } from '../../types/data';
import { computeTimeSeries, computePivot } from '../../utils/calculations';
import { formatCurrency, formatNumber, formatPercent, formatDate } from '../../utils/formatters';
import { TrendingUp, ArrowUpRight, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

interface OverviewViewProps {
  data: DataRecord[];
  metrics: MetricSummary;
  currency: CurrencyMode;
  onSelectClient?: (client: string) => void;
  onViewAllTable?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  data,
  metrics,
  currency,
  onSelectClient,
  onViewAllTable,
}) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'revenue' | 'profit' | 'volume'>('revenue');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const timeSeries = computeTimeSeries(data);
  const categoryGroups = computePivot(data, 'category');
  const channelGroups = computePivot(data, 'channel');
  const recentRecords = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7);

  // SVG dimensions for time series
  const svgWidth = 800;
  const svgHeight = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const values = timeSeries.map((d) => {
    if (activeMetricTab === 'revenue') return d.revenue;
    if (activeMetricTab === 'profit') return d.profit;
    return d.deals;
  });

  const maxVal = Math.max(...values, 1) * 1.15;
  const minVal = 0;

  const getX = (idx: number) => {
    if (timeSeries.length <= 1) return padding.left + chartW / 2;
    return padding.left + (idx / (timeSeries.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    return padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
  };

  const pointsPath = timeSeries.map((d, i) => `${getX(i)},${getY(values[i])}`).join(' ');
  const areaPath = timeSeries.length > 0
    ? `M ${getX(0)},${getY(values[0])} L ${timeSeries.map((d, i) => `${getX(i)},${getY(values[i])}`).join(' L ')} L ${getX(timeSeries.length - 1)},${padding.top + chartH} L ${getX(0)},${padding.top + chartH} Z`
    : '';

  // Secondary curve (Costs if revenue is active)
  const costValues = timeSeries.map((d) => d.cost);
  const costPointsPath = timeSeries.map((d, i) => `${getX(i)},${getY(costValues[i])}`).join(' ');

  const getStatusIcon = (st: string) => {
    switch (st) {
      case 'Concluído':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'Em Execução':
        return <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'Renovado':
        return <RefreshCw className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />;
      case 'Atrasado':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Main Section: Interactive Trend Chart */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              Evolução Histórica & Curva de Desempenho
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Trajetória mensal agregada baseada nos filtros atuais. Passe o cursor sobre os pontos para auditar valores.
            </p>
          </div>

          {/* Interactive Metric Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveMetricTab('revenue')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeMetricTab === 'revenue'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Receita vs Custo
            </button>
            <button
              onClick={() => setActiveMetricTab('profit')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeMetricTab === 'profit'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Lucro Líquido
            </button>
            <button
              onClick={() => setActiveMetricTab('volume')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeMetricTab === 'volume'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Nº de Operações
            </button>
          </div>
        </div>

        {/* SVG Time Series Line/Area */}
        <div className="relative mt-4 overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[620px] select-none"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padding.top + chartH * (1 - pct);
              const val = minVal + (maxVal - minVal) * pct;
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    className="text-neutral-200 dark:text-neutral-800"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-neutral-400 font-mono tabular-nums"
                  >
                    {activeMetricTab === 'volume' ? formatNumber(val) : formatCurrency(val, currency, true)}
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            {timeSeries.length > 0 && (
              <path
                d={areaPath}
                fill={activeMetricTab === 'profit' ? 'url(#profitGrad)' : 'url(#areaGrad)'}
              />
            )}

            {/* Secondary line (Costs) when in revenue tab */}
            {activeMetricTab === 'revenue' && timeSeries.length > 1 && (
              <polyline
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="4 4"
                points={costPointsPath}
              />
            )}

            {/* Primary line */}
            {timeSeries.length > 1 && (
              <polyline
                fill="none"
                stroke={activeMetricTab === 'profit' ? '#3b82f6' : '#10b981'}
                strokeWidth="2.5"
                points={pointsPath}
              />
            )}

            {/* X-axis labels and points */}
            {timeSeries.map((d, i) => {
              const x = getX(i);
              const y = getY(values[i]);
              const isHovered = hoveredPointIndex === i;

              return (
                <g key={i}>
                  {/* Axis label */}
                  <text
                    x={x}
                    y={padding.top + chartH + 20}
                    textAnchor="middle"
                    className={`text-[10px] font-mono transition-colors ${
                      isHovered ? 'fill-neutral-900 dark:fill-white font-bold' : 'fill-neutral-400'
                    }`}
                  >
                    {d.period}
                  </text>

                  {/* Vertical hover line */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + chartH}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-neutral-400 dark:text-neutral-600"
                    />
                  )}

                  {/* Interactive circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 3.5}
                    className={`transition-all cursor-pointer ${
                      activeMetricTab === 'profit'
                        ? 'fill-blue-500 stroke-white dark:stroke-neutral-900'
                        : 'fill-emerald-500 stroke-white dark:stroke-neutral-900'
                    }`}
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredPointIndex(i)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredPointIndex !== null && timeSeries[hoveredPointIndex] && (
            <div
              className="absolute pointer-events-none bg-neutral-900/95 dark:bg-neutral-800/95 text-white p-3 rounded-lg text-xs shadow-lg border border-neutral-700 font-mono tabular-nums -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(getX(hoveredPointIndex) / svgWidth) * 100}%`,
                top: `${(getY(values[hoveredPointIndex]) / svgHeight) * 100}%`,
                marginTop: '-12px',
              }}
            >
              <div className="font-semibold text-neutral-200 border-b border-neutral-700 pb-1 mb-1.5">
                {timeSeries[hoveredPointIndex].period}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-emerald-400">Receita:</span>
                  <span>{formatCurrency(timeSeries[hoveredPointIndex].revenue, currency)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-400">Custos:</span>
                  <span>{formatCurrency(timeSeries[hoveredPointIndex].cost, currency)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-blue-400">Lucro Líquido:</span>
                  <span>{formatCurrency(timeSeries[hoveredPointIndex].profit, currency)}</span>
                </div>
                <div className="flex justify-between gap-4 pt-1 border-t border-neutral-800 text-[11px] text-neutral-400">
                  <span>Margem / Operações:</span>
                  <span>{formatPercent(timeSeries[hoveredPointIndex].margin)} · {timeSeries[hoveredPointIndex].deals} ops</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-0.5 ${activeMetricTab === 'profit' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
              <span>{activeMetricTab === 'profit' ? 'Lucro Líquido' : 'Receita Gerada'}</span>
            </div>
            {activeMetricTab === 'revenue' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-400 border-b border-dashed" />
                <span>Custo Operacional</span>
              </div>
            )}
          </div>
          <span className="text-neutral-400">Intervalo amostral contínuo</span>
        </div>
      </div>

      {/* Two Columns Grid: Categories breakdown & Acquisition channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Categories Performance Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Distribuição por Categoria de Solução
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Participação de receita e margem média por linha de produto
              </p>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
              {categoryGroups.length} categorias
            </span>
          </div>

          <div className="space-y-4">
            {categoryGroups.map((cat) => {
              const pctOfTotal = metrics.totalRevenue > 0 ? (cat.revenue / metrics.totalRevenue) * 100 : 0;
              return (
                <div key={cat.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{cat.key}</span>
                    <div className="flex items-center gap-3 font-mono tabular-nums text-neutral-600 dark:text-neutral-300">
                      <span>{formatCurrency(cat.revenue, currency)}</span>
                      <span className="text-neutral-400">({formatPercent(pctOfTotal)})</span>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-neutral-900 dark:bg-neutral-100 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pctOfTotal}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
                    <span>{cat.count} contratos · margem: {formatPercent(cat.margin)}</span>
                    <span>CSAT: {cat.avgCsat.toFixed(1)}/5.0</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acquisition Channel Breakdown */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Canais de Aquisição & Conversão
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Origem comercial dos contratos fechados e rentabilidade
              </p>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
              {channelGroups.length} canais
            </span>
          </div>

          <div className="space-y-4">
            {channelGroups.map((ch) => {
              const pctOfTotal = metrics.totalRevenue > 0 ? (ch.revenue / metrics.totalRevenue) * 100 : 0;
              return (
                <div key={ch.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{ch.key}</span>
                    <div className="flex items-center gap-3 font-mono tabular-nums text-neutral-600 dark:text-neutral-300">
                      <span>{formatCurrency(ch.revenue, currency)}</span>
                      <span className="text-neutral-400">({formatPercent(pctOfTotal)})</span>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pctOfTotal}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
                    <span>{ch.count} negócios · ticket: {formatCurrency(ch.avgTicket, currency, true)}</span>
                    <span>margem: {formatPercent(ch.margin)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent High-Impact Deals Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Transações Recentes & Status dos Contratos
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Últimas operações corporativas registradas no sistema
            </p>
          </div>
          {onViewAllTable && (
            <button
              onClick={onViewAllTable}
              className="flex items-center gap-1 text-xs font-medium text-neutral-900 dark:text-white hover:underline transition-colors"
            >
              <span>Ver todas ({data.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                <th className="py-2.5 px-3">Data</th>
                <th className="py-2.5 px-3">Cliente</th>
                <th className="py-2.5 px-3">Produto</th>
                <th className="py-2.5 px-3">Região</th>
                <th className="py-2.5 px-3 text-right">Receita</th>
                <th className="py-2.5 px-3 text-right">Margem</th>
                <th className="py-2.5 px-3 text-right">CSAT</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono tabular-nums">
              {recentRecords.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectClient?.(item.client)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-850/50 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-medium text-neutral-900 dark:text-white whitespace-nowrap">
                    {item.client}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                    {item.product}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {item.region}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                    {formatCurrency(item.revenue, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                    {formatPercent(item.margin)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                    {item.csat.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-sans text-xs">
                      {getStatusIcon(item.status)}
                      <span>{item.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
