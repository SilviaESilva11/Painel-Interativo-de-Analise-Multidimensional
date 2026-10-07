import React, { useState } from 'react';
import { DataRecord, CurrencyMode } from '../../types/data';
import { ALL_REGIONS, ALL_CATEGORIES } from '../../data/initialData';
import { computePivot, computeTimeSeries } from '../../utils/calculations';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';
import { 
  LineChart, 
  BarChart2, 
  PieChart, 
  Activity, 
  Grid, 
  Compass,
  Info
} from 'lucide-react';

interface ChartsViewProps {
  data: DataRecord[];
  currency: CurrencyMode;
}

type ChartType = 'line' | 'bar' | 'donut' | 'scatter' | 'heatmap' | 'radar';

export const ChartsView: React.FC<ChartsViewProps> = ({ data, currency }) => {
  const [activeChart, setActiveChart] = useState<ChartType>('bar');
  const [barDimension, setBarDimension] = useState<'category' | 'channel' | 'region'>('category');
  const [donutDimension, setDonutDimension] = useState<'category' | 'region'>('category');
  const [hoveredDonutIdx, setHoveredDonutIdx] = useState<number | null>(null);
  const [hoveredScatterPoint, setHoveredScatterPoint] = useState<DataRecord | null>(null);

  const timeSeries = computeTimeSeries(data);
  const barGroups = computePivot(data, barDimension);
  const donutGroups = computePivot(data, donutDimension);

  const totalRevenue = data.reduce((acc, it) => acc + it.revenue, 0);

  // Palette for chart items
  const colors = [
    '#059669', // Emerald
    '#2563eb', // Blue
    '#7c3aed', // Violet
    '#d97706', // Amber
    '#dc2626', // Red
    '#0891b2', // Cyan
    '#4b5563', // Gray
  ];

  const chartTabs = [
    { id: 'bar', label: 'Barras Comparativas', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'line', label: 'Tendência Temporal', icon: <LineChart className="w-4 h-4" /> },
    { id: 'donut', label: 'Composição & Proporção', icon: <PieChart className="w-4 h-4" /> },
    { id: 'scatter', label: 'Dispersão & Bolhas', icon: <Activity className="w-4 h-4" /> },
    { id: 'heatmap', label: 'Mapa de Calor (Matriz)', icon: <Grid className="w-4 h-4" /> },
    { id: 'radar', label: 'Radar Multidimensional', icon: <Compass className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-6">
      
      {/* Chart Selector Navigation Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {chartTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id as ChartType)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeChart === tab.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 font-mono tabular-nums shrink-0">
            <Info className="w-3.5 h-3.5" />
            <span>{data.length} amostras na série</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs transition-colors">
        
        {/* 1. BAR CHART */}
        {activeChart === 'bar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Comparativo de Volume e Receita em Barras
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Análise comparativa das métricas agregadas na dimensão selecionada
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
                {(['category', 'channel', 'region'] as const).map((dim) => (
                  <button
                    key={dim}
                    onClick={() => setBarDimension(dim)}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      barDimension === dim
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {dim === 'category' ? 'Por Categoria' : dim === 'channel' ? 'Por Canal' : 'Por Região'}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Column / Bar Chart Render */}
            <div className="pt-4">
              {(() => {
                const maxBarRev = Math.max(...barGroups.map((g) => g.revenue), 1);
                return (
                  <div className="space-y-5">
                    {barGroups.map((g, idx) => {
                      const pct = (g.revenue / maxBarRev) * 100;
                      const shareTotal = totalRevenue > 0 ? (g.revenue / totalRevenue) * 100 : 0;
                      return (
                        <div key={g.key} className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                              {g.key}
                            </span>
                            <div className="flex items-center gap-3 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                              <span className="font-semibold text-neutral-900 dark:text-white">
                                {formatCurrency(g.revenue, currency)}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{formatPercent(shareTotal)} da receita</span>
                              <span aria-hidden="true">·</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                {formatPercent(g.margin)} margem
                              </span>
                            </div>
                          </div>

                          <div className="relative w-full bg-neutral-100 dark:bg-neutral-800 h-6 rounded-md overflow-hidden flex items-center">
                            <div
                              className="h-full rounded-md transition-all duration-500 flex items-center pl-2"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: colors[idx % colors.length],
                              }}
                            >
                              {pct > 15 && (
                                <span className="text-[11px] font-mono text-white font-medium drop-shadow-xs">
                                  {g.count} ops
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
                            <span>Ticket médio: {formatCurrency(g.avgTicket, currency, true)}</span>
                            <span>CSAT Médio: {g.avgCsat.toFixed(1)}/5.0</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* 2. TIME SERIES CHART */}
        {activeChart === 'line' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Tendência Temporal & Comparativo de Margens
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Receita bruta vs custos com curva de margem ponderada no tempo
              </p>
            </div>

            {(() => {
              const svgW = 800;
              const svgH = 300;
              const pad = { top: 30, right: 40, bottom: 40, left: 70 };
              const w = svgW - pad.left - pad.right;
              const h = svgH - pad.top - pad.bottom;

              const maxRev = Math.max(...timeSeries.map((t) => t.revenue), 1) * 1.15;
              const getX = (i: number) => pad.left + (i / Math.max(timeSeries.length - 1, 1)) * w;
              const getY = (val: number) => pad.top + h - (val / maxRev) * h;

              return (
                <div className="overflow-x-auto">
                  <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto min-w-[640px]">
                    {/* Y Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                      const y = pad.top + h * (1 - pct);
                      return (
                        <g key={i}>
                          <line
                            x1={pad.left}
                            y1={y}
                            x2={svgW - pad.right}
                            y2={y}
                            stroke="currentColor"
                            strokeDasharray="3 3"
                            className="text-neutral-200 dark:text-neutral-800"
                          />
                          <text
                            x={pad.left - 10}
                            y={y + 4}
                            textAnchor="end"
                            className="text-[10px] fill-neutral-400 font-mono tabular-nums"
                          >
                            {formatCurrency(maxRev * pct, currency, true)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Cost line */}
                    <polyline
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      points={timeSeries.map((d, i) => `${getX(i)},${getY(d.cost)}`).join(' ')}
                    />

                    {/* Revenue line */}
                    <polyline
                      fill="none"
                      stroke="#059669"
                      strokeWidth="3"
                      points={timeSeries.map((d, i) => `${getX(i)},${getY(d.revenue)}`).join(' ')}
                    />

                    {/* Revenue points */}
                    {timeSeries.map((d, i) => (
                      <g key={i}>
                        <circle
                          cx={getX(i)}
                          cy={getY(d.revenue)}
                          r={4}
                          className="fill-emerald-600 stroke-white dark:stroke-neutral-900"
                          strokeWidth="2"
                        />
                        <text
                          x={getX(i)}
                          y={pad.top + h + 20}
                          textAnchor="middle"
                          className="text-[10px] fill-neutral-500 font-mono"
                        >
                          {d.period}
                        </text>
                      </g>
                    ))}
                  </svg>

                  <div className="mt-4 flex items-center justify-center gap-6 text-xs font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-0.5 bg-emerald-600" />
                      <span>Receita Bruta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-0.5 bg-slate-400 border-b border-dashed" />
                      <span>Custo de Operação</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 3. DONUT / PIE CHART */}
        {activeChart === 'donut' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Composição Percentual & Market Share Interno
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Proporção de cada segmento na receita total gerada
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
                {(['category', 'region'] as const).map((dim) => (
                  <button
                    key={dim}
                    onClick={() => setDonutDimension(dim)}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      donutDimension === dim
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {dim === 'category' ? 'Categorias' : 'Regiões'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
              {/* SVG Donut */}
              <div className="lg:col-span-5 flex justify-center">
                {(() => {
                  const size = 260;
                  const radius = 90;
                  const strokeWidth = 36;
                  const circumference = 2 * Math.PI * radius;
                  let accumulatedOffset = 0;

                  return (
                    <div className="relative w-[260px] h-[260px] flex items-center justify-center">
                      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
                        {donutGroups.map((g, idx) => {
                          const pct = totalRevenue > 0 ? g.revenue / totalRevenue : 0;
                          const dashLength = pct * circumference;
                          const dashOffset = -accumulatedOffset;
                          accumulatedOffset += dashLength;
                          const isHovered = hoveredDonutIdx === idx;

                          return (
                            <circle
                              key={g.key}
                              cx={size / 2}
                              cy={size / 2}
                              r={radius}
                              fill="transparent"
                              stroke={colors[idx % colors.length]}
                              strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                              strokeDashoffset={dashOffset}
                              className="transition-all duration-300 cursor-pointer"
                              onMouseEnter={() => setHoveredDonutIdx(idx)}
                              onMouseLeave={() => setHoveredDonutIdx(null)}
                            />
                          );
                        })}
                      </svg>

                      {/* Center Info */}
                      <div className="absolute text-center pointer-events-none font-mono">
                        <span className="text-[11px] text-neutral-400 block uppercase">
                          {hoveredDonutIdx !== null ? donutGroups[hoveredDonutIdx]?.key : 'Total Geral'}
                        </span>
                        <span className="text-sm font-bold text-neutral-900 dark:text-white tabular-nums block">
                          {hoveredDonutIdx !== null
                            ? formatCurrency(donutGroups[hoveredDonutIdx]?.revenue || 0, currency, true)
                            : formatCurrency(totalRevenue, currency, true)}
                        </span>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                          {hoveredDonutIdx !== null
                            ? formatPercent(
                                totalRevenue > 0
                                  ? ((donutGroups[hoveredDonutIdx]?.revenue || 0) / totalRevenue) * 100
                                  : 0
                              )
                            : '100%'}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Legend with interactive details */}
              <div className="lg:col-span-7 space-y-3">
                {donutGroups.map((g, idx) => {
                  const pct = totalRevenue > 0 ? (g.revenue / totalRevenue) * 100 : 0;
                  const isHovered = hoveredDonutIdx === idx;

                  return (
                    <div
                      key={g.key}
                      onMouseEnter={() => setHoveredDonutIdx(idx)}
                      onMouseLeave={() => setHoveredDonutIdx(null)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isHovered
                          ? 'border-neutral-400 bg-neutral-50 dark:bg-neutral-800'
                          : 'border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-xs shrink-0"
                            style={{ backgroundColor: colors[idx % colors.length] }}
                          />
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {g.key}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono tabular-nums">
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {formatCurrency(g.revenue, currency)}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {formatPercent(pct)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-neutral-500 font-mono tabular-nums">
                        <span>{g.count} contratos · ticket {formatCurrency(g.avgTicket, currency, true)}</span>
                        <span>margem: {formatPercent(g.margin)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. SCATTER PLOT */}
        {activeChart === 'scatter' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Dispersão: Receita vs Margem de Lucro vs Volume
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Eixo X = Receita (R$), Eixo Y = Margem de Lucro (%), Tamanho da Bolha = Volume de Licenças/Unidades. Passe o cursor sobre uma bolha para identificar o cliente.
              </p>
            </div>

            {(() => {
              const svgW = 800;
              const svgH = 340;
              const pad = { top: 30, right: 40, bottom: 45, left: 70 };
              const w = svgW - pad.left - pad.right;
              const h = svgH - pad.top - pad.bottom;

              const maxRev = Math.max(...data.map((d) => d.revenue), 1) * 1.08;
              const maxMargin = 85;
              const minMargin = 30;

              const getX = (rev: number) => pad.left + (rev / maxRev) * w;
              const getY = (m: number) => pad.top + h - ((m - minMargin) / (maxMargin - minMargin)) * h;

              return (
                <div className="relative overflow-x-auto">
                  <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto min-w-[640px]">
                    {/* Y Grid (Margin %) */}
                    {[30, 40, 50, 60, 70, 80].map((mVal) => {
                      const y = getY(mVal);
                      return (
                        <g key={mVal}>
                          <line
                            x1={pad.left}
                            y1={y}
                            x2={svgW - pad.right}
                            y2={y}
                            stroke="currentColor"
                            strokeDasharray="2 3"
                            className="text-neutral-200 dark:text-neutral-800"
                          />
                          <text
                            x={pad.left - 8}
                            y={y + 4}
                            textAnchor="end"
                            className="text-[10px] fill-neutral-400 font-mono tabular-nums"
                          >
                            {mVal}%
                          </text>
                        </g>
                      );
                    })}

                    {/* X Grid (Revenue) */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                      const x = pad.left + w * pct;
                      const val = maxRev * pct;
                      return (
                        <g key={i}>
                          <line
                            x1={x}
                            y1={pad.top}
                            x2={x}
                            y2={pad.top + h}
                            stroke="currentColor"
                            strokeDasharray="2 3"
                            className="text-neutral-200 dark:text-neutral-800"
                          />
                          <text
                            x={x}
                            y={pad.top + h + 20}
                            textAnchor="middle"
                            className="text-[10px] fill-neutral-400 font-mono tabular-nums"
                          >
                            {formatCurrency(val, currency, true)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Data Points */}
                    {data.map((item) => {
                      const cx = getX(item.revenue);
                      const cy = getY(item.margin);
                      // Radius based on volume
                      const r = Math.max(4, Math.min(14, (item.volume / 3500) * 14));
                      const isHovered = hoveredScatterPoint?.id === item.id;

                      const catIdx = ALL_CATEGORIES.indexOf(item.category as typeof ALL_CATEGORIES[number]);
                      const color = colors[catIdx % colors.length] || '#2563eb';

                      return (
                        <circle
                          key={item.id}
                          cx={cx}
                          cy={cy}
                          r={isHovered ? r + 4 : r}
                          fill={color}
                          fillOpacity={isHovered ? 0.95 : 0.65}
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 2.5 : 1}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredScatterPoint(item)}
                          onMouseLeave={() => setHoveredScatterPoint(null)}
                        />
                      );
                    })}
                  </svg>

                  {/* Scatter Hover Tooltip */}
                  {hoveredScatterPoint && (
                    <div className="absolute top-2 right-4 bg-neutral-900/95 dark:bg-neutral-800/95 text-white p-3 rounded-lg text-xs shadow-lg border border-neutral-700 font-mono tabular-nums max-w-xs pointer-events-none">
                      <div className="font-semibold text-white border-b border-neutral-700 pb-1 mb-1">
                        {hoveredScatterPoint.client}
                      </div>
                      <div className="space-y-0.5 text-neutral-300">
                        <p><span className="text-neutral-400">Produto:</span> {hoveredScatterPoint.product}</p>
                        <p><span className="text-neutral-400">Receita:</span> {formatCurrency(hoveredScatterPoint.revenue, currency)}</p>
                        <p><span className="text-neutral-400">Margem:</span> {formatPercent(hoveredScatterPoint.margin)}</p>
                        <p><span className="text-neutral-400">Volume:</span> {formatNumber(hoveredScatterPoint.volume)} unidades</p>
                        <p><span className="text-neutral-400">CSAT:</span> {hoveredScatterPoint.csat.toFixed(1)} / 5.0</p>
                      </div>
                    </div>
                  )}

                  {/* Axis Legends */}
                  <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 font-mono tabular-nums">
                    <span>Eixo X: Receita Bruta da Transação</span>
                    <span>Eixo Y: Margem Operacional %</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 5. HEATMAP MATRIX */}
        {activeChart === 'heatmap' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Matriz de Calor: Categoria vs Polo Territorial
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Intensidade de cor proporcional ao volume de faturamento em cada interseção
              </p>
            </div>

            {(() => {
              // Calculate cells
              const matrixMap = new Map<string, number>();
              let maxCellRevenue = 0;

              for (const it of data) {
                const key = `${it.category}___${it.region}`;
                const prev = matrixMap.get(key) || 0;
                const next = prev + it.revenue;
                matrixMap.set(key, next);
                if (next > maxCellRevenue) maxCellRevenue = next;
              }

              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="p-3 text-left font-medium text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                          Categoria / Região
                        </th>
                        {ALL_REGIONS.map((reg) => (
                          <th
                            key={reg}
                            className="p-3 text-center font-medium text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800"
                          >
                            {reg}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono tabular-nums">
                      {ALL_CATEGORIES.map((cat) => (
                        <tr key={cat}>
                          <td className="p-3 font-sans font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                            {cat}
                          </td>
                          {ALL_REGIONS.map((reg) => {
                            const val = matrixMap.get(`${cat}___${reg}`) || 0;
                            const intensity = maxCellRevenue > 0 ? val / maxCellRevenue : 0;

                            // Emerald gradient based on intensity
                            const bgStyle =
                              val === 0
                                ? undefined
                                : {
                                    backgroundColor: `rgba(5, 150, 105, ${Math.max(0.12, intensity * 0.85)})`,
                                    color: intensity > 0.5 ? '#ffffff' : undefined,
                                  };

                            return (
                              <td
                                key={reg}
                                className="p-3 text-center border border-neutral-100 dark:border-neutral-800/40 transition-colors"
                                style={bgStyle}
                              >
                                {val > 0 ? (
                                  <div className="font-semibold">
                                    <span>{formatCurrency(val, currency, true)}</span>
                                  </div>
                                ) : (
                                  <span className="text-neutral-300 dark:text-neutral-700">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 flex items-center justify-end gap-2 text-xs font-mono text-neutral-500">
                    <span>Baixa densidade</span>
                    <div className="flex h-3 w-32 rounded-xs bg-gradient-to-r from-emerald-100 to-emerald-700 dark:from-emerald-950 dark:to-emerald-500" />
                    <span>Alta densidade</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 6. RADAR / SPIDER CHART */}
        {activeChart === 'radar' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Radar de Eficiência Multidimensional
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Pontuação normalizada (0 a 100%) em 5 dimensões estratégicas da operação
              </p>
            </div>

            {(() => {
              const svgSize = 380;
              const center = svgSize / 2;
              const maxR = 130;

              // Compute normalized dimensions
              const completedCount = data.filter((d) => d.status === 'Concluído' || d.status === 'Renovado').length;
              const completionRate = data.length > 0 ? (completedCount / data.length) * 100 : 0;
              const avgCsat = data.length > 0 ? (data.reduce((a, b) => a + b.csat, 0) / data.length / 5) * 100 : 0;
              const avgMarginNorm = data.length > 0 ? (data.reduce((a, b) => a + b.margin, 0) / data.length / 80) * 100 : 0;
              const avgLeadTime = data.length > 0 ? data.reduce((a, b) => a + b.leadTimeDays, 0) / data.length : 30;
              const velocityScore = Math.max(0, 100 - (avgLeadTime / 50) * 100);
              const revenueTargetPacing = 88;

              const radarAxes = [
                { label: 'Margem %', value: Math.min(100, avgMarginNorm) },
                { label: 'Índice CSAT', value: Math.min(100, avgCsat) },
                { label: 'Taxa Conclusão', value: Math.min(100, completionRate) },
                { label: 'Velocidade Ciclo', value: Math.min(100, velocityScore) },
                { label: 'Atingimento Meta', value: revenueTargetPacing },
              ];

              const totalAngles = radarAxes.length;
              const getCoords = (val: number, idx: number) => {
                const angle = (idx * 2 * Math.PI) / totalAngles - Math.PI / 2;
                const r = (val / 100) * maxR;
                return {
                  x: center + r * Math.cos(angle),
                  y: center + r * Math.sin(angle),
                };
              };

              const polygonPoints = radarAxes
                .map((ax, i) => {
                  const c = getCoords(ax.value, i);
                  return `${c.x},${c.y}`;
                })
                .join(' ');

              return (
                <div className="flex flex-col items-center justify-center pt-2">
                  <svg width={svgSize} height={svgSize} className="select-none">
                    {/* Concentric rings */}
                    {[0.25, 0.5, 0.75, 1].map((pct, ringIdx) => {
                      const ringPoints = Array.from({ length: totalAngles })
                        .map((_, i) => {
                          const angle = (i * 2 * Math.PI) / totalAngles - Math.PI / 2;
                          const r = pct * maxR;
                          return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                        })
                        .join(' ');
                      return (
                        <g key={ringIdx}>
                          <polygon
                            points={ringPoints}
                            fill="none"
                            stroke="currentColor"
                            className="text-neutral-200 dark:text-neutral-800"
                            strokeWidth="1"
                          />
                          <text
                            x={center + 6}
                            y={center - pct * maxR + 10}
                            className="text-[9px] fill-neutral-400 font-mono"
                          >
                            {pct * 100}%
                          </text>
                        </g>
                      );
                    })}

                    {/* Spokes */}
                    {radarAxes.map((_, i) => {
                      const angle = (i * 2 * Math.PI) / totalAngles - Math.PI / 2;
                      const endX = center + maxR * Math.cos(angle);
                      const endY = center + maxR * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={center}
                          y1={center}
                          x2={endX}
                          y2={endY}
                          stroke="currentColor"
                          className="text-neutral-200 dark:text-neutral-800"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Data polygon */}
                    <polygon
                      points={polygonPoints}
                      fill="rgba(5, 150, 105, 0.25)"
                      stroke="#059669"
                      strokeWidth="2.5"
                    />

                    {/* Vertices & Axis Labels */}
                    {radarAxes.map((ax, i) => {
                      const c = getCoords(ax.value, i);
                      const angle = (i * 2 * Math.PI) / totalAngles - Math.PI / 2;
                      const labelDist = maxR + 24;
                      const lx = center + labelDist * Math.cos(angle);
                      const ly = center + labelDist * Math.sin(angle);

                      return (
                        <g key={i}>
                          <circle
                            cx={c.x}
                            cy={c.y}
                            r={4}
                            className="fill-emerald-600 stroke-white dark:stroke-neutral-900"
                            strokeWidth="2"
                          />
                          <text
                            x={lx}
                            y={ly + 4}
                            textAnchor="middle"
                            className="text-[11px] font-medium fill-neutral-700 dark:fill-neutral-300 font-mono"
                          >
                            {ax.label} ({ax.value.toFixed(0)}%)
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
};
