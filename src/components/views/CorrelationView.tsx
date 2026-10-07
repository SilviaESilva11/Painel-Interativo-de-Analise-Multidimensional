import React, { useState } from 'react';
import { DataRecord, NumericField, CurrencyMode } from '../../types/data';
import { ALL_CATEGORIES, ALL_REGIONS, ALL_CHANNELS, ALL_STATUSES } from '../../data/initialData';
import { computeCorrelation } from '../../utils/calculations';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';
import { ScatterChart as ScatterIcon, Sliders, ArrowRight } from 'lucide-react';

interface CorrelationViewProps {
  data: DataRecord[];
  currency: CurrencyMode;
}

export const CorrelationView: React.FC<CorrelationViewProps> = ({ data, currency }) => {
  const [xField, setXField] = useState<NumericField>('revenue');
  const [yField, setYField] = useState<NumericField>('margin');
  const [colorBy, setColorBy] = useState<'category' | 'region' | 'channel' | 'status'>('category');
  const [hoveredItem, setHoveredItem] = useState<DataRecord | null>(null);

  const fieldLabels: Record<NumericField, string> = {
    revenue: 'Receita Total (R$)',
    cost: 'Custo de Entrega (R$)',
    margin: 'Margem de Lucro (%)',
    volume: 'Volume Contratado (Unidades)',
    csat: 'Índice de Satisfação (CSAT)',
    leadTimeDays: 'Ciclo de Implantação (Dias)',
  };

  const correlation = computeCorrelation(data, xField, yField);

  // Palette
  const colors = [
    '#059669', // Emerald
    '#2563eb', // Blue
    '#7c3aed', // Violet
    '#d97706', // Amber
    '#dc2626', // Red
    '#0891b2', // Cyan
  ];

  const getColor = (item: DataRecord) => {
    let list: readonly string[] = ALL_CATEGORIES;
    let val: string = item.category;

    if (colorBy === 'region') {
      list = ALL_REGIONS;
      val = item.region;
    } else if (colorBy === 'channel') {
      list = ALL_CHANNELS;
      val = item.channel;
    } else if (colorBy === 'status') {
      list = ALL_STATUSES;
      val = item.status;
    }

    const idx = list.indexOf(val as any);
    return colors[idx % colors.length] || '#2563eb';
  };

  const formatFieldValue = (field: NumericField, val: number) => {
    if (field === 'revenue' || field === 'cost') return formatCurrency(val, currency, true);
    if (field === 'margin') return formatPercent(val);
    if (field === 'csat') return `${val.toFixed(2)}/5.0`;
    if (field === 'leadTimeDays') return `${Math.round(val)} dias`;
    return formatNumber(val);
  };

  // SVG Chart geometry
  const svgW = 800;
  const svgH = 340;
  const pad = { top: 30, right: 40, bottom: 50, left: 75 };
  const w = svgW - pad.left - pad.right;
  const h = svgH - pad.top - pad.bottom;

  const xVals = data.map((d) => d[xField]);
  const yVals = data.map((d) => d[yField]);

  const minX = Math.min(...xVals, 0);
  const maxX = Math.max(...xVals, 1) * 1.05;

  const minY = Math.min(...yVals, 0);
  const maxY = Math.max(...yVals, 1) * 1.05;

  const getX = (val: number) => pad.left + ((val - minX) / (maxX - minX || 1)) * w;
  const getY = (val: number) => pad.top + h - ((val - minY) / (maxY - minY || 1)) * h;

  return (
    <div className="space-y-6">
      
      {/* Configuration & Hypothesis Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <ScatterIcon className="w-4 h-4 text-emerald-600" />
              <span>Explorador de Correlações Estatísticas & Dispersão Customizável</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Cruze duas variáveis numéricas quaisquer para inspecionar relações de causa, dispersão e coeficiente r de Pearson.
            </p>
          </div>

          {/* Axis Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Sliders className="w-3.5 h-3.5" />
              <span>Eixo X:</span>
            </div>
            <select
              value={xField}
              onChange={(e) => setXField(e.target.value as NumericField)}
              className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white font-medium cursor-pointer"
            >
              {(Object.keys(fieldLabels) as NumericField[]).map((f) => (
                <option key={f} value={f}>{fieldLabels[f]}</option>
              ))}
            </select>

            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />

            <div className="flex items-center gap-1.5 text-neutral-500">
              <span>Eixo Y:</span>
            </div>
            <select
              value={yField}
              onChange={(e) => setYField(e.target.value as NumericField)}
              className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white font-medium cursor-pointer"
            >
              {(Object.keys(fieldLabels) as NumericField[]).map((f) => (
                <option key={f} value={f}>{fieldLabels[f]}</option>
              ))}
            </select>

            <span className="text-neutral-300 dark:text-neutral-700">|</span>

            <div className="flex items-center gap-1.5 text-neutral-500">
              <span>Colorir por:</span>
            </div>
            <select
              value={colorBy}
              onChange={(e) => setColorBy(e.target.value as typeof colorBy)}
              className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white font-medium cursor-pointer"
            >
              <option value="category">Categoria</option>
              <option value="region">Região</option>
              <option value="channel">Canal</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pearson Statistical Insight Box */}
      <div className="bg-neutral-900 dark:bg-neutral-850 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div>
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
            Coeficiente de Correlação de Pearson (r)
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-bold text-emerald-400 tabular-nums">
              r = {correlation.r.toFixed(3)}
            </span>
            <span className="text-xs text-neutral-300 font-sans">
              · {correlation.interpretation}
            </span>
          </div>
        </div>

        <div className="text-xs text-neutral-400 space-y-1">
          <div>Média X ({fieldLabels[xField]}): <span className="text-white font-semibold">{formatFieldValue(xField, correlation.xMean)}</span></div>
          <div>Média Y ({fieldLabels[yField]}): <span className="text-white font-semibold">{formatFieldValue(yField, correlation.yMean)}</span></div>
        </div>
      </div>

      {/* SVG Scatter Chart */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="relative overflow-x-auto">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto min-w-[640px]">
            {/* Y Axis Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const yVal = minY + (maxY - minY) * pct;
              const y = getY(yVal);
              return (
                <g key={i}>
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
                    {formatFieldValue(yField, yVal)}
                  </text>
                </g>
              );
            })}

            {/* X Axis Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const xVal = minX + (maxX - minX) * pct;
              const x = getX(xVal);
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
                    {formatFieldValue(xField, xVal)}
                  </text>
                </g>
              );
            })}

            {/* Mean Crosshair lines */}
            <line
              x1={getX(correlation.xMean)}
              y1={pad.top}
              x2={getX(correlation.xMean)}
              y2={pad.top + h}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <line
              x1={pad.left}
              y1={getY(correlation.yMean)}
              x2={svgW - pad.right}
              y2={getY(correlation.yMean)}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Scatter Points */}
            {data.map((item) => {
              const cx = getX(item[xField]);
              const cy = getY(item[yField]);
              const isHovered = hoveredItem?.id === item.id;
              const color = getColor(item);

              return (
                <circle
                  key={item.id}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 8 : 5}
                  fill={color}
                  fillOpacity={isHovered ? 1 : 0.75}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2.5 : 1}
                  className="cursor-pointer transition-all duration-100"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              );
            })}
          </svg>

          {/* Interactive Floating Hover Info */}
          {hoveredItem && (
            <div className="absolute top-3 right-4 bg-neutral-900/95 dark:bg-neutral-800/95 text-white p-3 rounded-lg text-xs shadow-lg border border-neutral-700 font-mono tabular-nums pointer-events-none max-w-xs">
              <div className="font-semibold text-white border-b border-neutral-700 pb-1 mb-1">
                {hoveredItem.client}
              </div>
              <div className="space-y-0.5 text-neutral-300">
                <p><span className="text-neutral-400">Produto:</span> {hoveredItem.product}</p>
                <p><span className="text-neutral-400">{fieldLabels[xField]}:</span> {formatFieldValue(xField, hoveredItem[xField])}</p>
                <p><span className="text-neutral-400">{fieldLabels[yField]}:</span> {formatFieldValue(yField, hoveredItem[yField])}</p>
                <p><span className="text-neutral-400">Região / Canal:</span> {hoveredItem.region} · {hoveredItem.channel}</p>
              </div>
            </div>
          )}

          {/* Labels for Axis */}
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Eixo X: {fieldLabels[xField]}</span>
            <span>Eixo Y: {fieldLabels[yField]}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
