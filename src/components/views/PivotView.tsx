import React, { useState } from 'react';
import { DataRecord, CurrencyMode } from '../../types/data';
import { computePivot, PivotGroup } from '../../utils/calculations';
import { formatCurrency, formatNumber, formatPercent, formatDate } from '../../utils/formatters';
import { ChevronDown, ChevronRight, ArrowUpDown, Layers, Filter } from 'lucide-react';

interface PivotViewProps {
  data: DataRecord[];
  currency: CurrencyMode;
}

type GroupDimension = 'region' | 'category' | 'channel' | 'status' | 'quarter';

export const PivotView: React.FC<PivotViewProps> = ({ data, currency }) => {
  const [groupBy, setGroupBy] = useState<GroupDimension>('region');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<'revenue' | 'profit' | 'margin' | 'count' | 'avgCsat'>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const groups = computePivot(data, groupBy);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    groups.forEach((g) => (next[g.key] = true));
    setExpandedGroups(next);
  };

  const collapseAll = () => {
    setExpandedGroups({});
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedGroups = [...groups].sort((a, b) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    return (a[sortField] - b[sortField]) * factor;
  });

  const dimensionLabels: Record<GroupDimension, string> = {
    region: 'Polo Territorial (Região)',
    category: 'Linha de Solução (Categoria)',
    channel: 'Canal de Aquisição',
    status: 'Status Operacional',
    quarter: 'Trimestre Fiscal',
  };

  // Grand totals
  const totalRev = groups.reduce((acc, g) => acc + g.revenue, 0);
  const totalCost = groups.reduce((acc, g) => acc + g.cost, 0);
  const totalProfit = totalRev - totalCost;
  const grandMargin = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;
  const totalDeals = groups.reduce((acc, g) => acc + g.count, 0);

  return (
    <div className="space-y-6">
      
      {/* Control Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Tabela Dinâmica de Agrupamento & Drill-down</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Agrupe transações multidimensionalmente e expanda cada linha para auditar os contratos subjacentes.
            </p>
          </div>

          {/* Group Dimension Selector & Expand/Collapse */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Agrupar por:</span>
            </div>

            <select
              value={groupBy}
              onChange={(e) => {
                setGroupBy(e.target.value as GroupDimension);
                setExpandedGroups({});
              }}
              className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="region">Região</option>
              <option value="category">Categoria</option>
              <option value="channel">Canal</option>
              <option value="status">Status</option>
              <option value="quarter">Trimestre</option>
            </select>

            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              Expandir Tudo
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              Recolher Tudo
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Pivot Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold select-none">
                <th className="py-3 px-4 w-72">
                  {dimensionLabels[groupBy]}
                </th>
                <th
                  onClick={() => handleSort('count')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Contratos</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('revenue')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Receita Total</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">
                  Custo Total
                </th>
                <th
                  onClick={() => handleSort('profit')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Lucro Líquido</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('margin')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Margem Média</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('avgCsat')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>CSAT Médio</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">
                  Ticket Médio
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono tabular-nums">
              {sortedGroups.map((group) => {
                const isExpanded = !!expandedGroups[group.key];
                const shareOfRev = totalRev > 0 ? (group.revenue / totalRev) * 100 : 0;

                return (
                  <React.Fragment key={group.key}>
                    {/* Master Group Row */}
                    <tr
                      onClick={() => toggleGroup(group.key)}
                      className={`cursor-pointer transition-colors ${
                        isExpanded
                          ? 'bg-neutral-50 dark:bg-neutral-800/70 font-semibold'
                          : 'hover:bg-neutral-50/70 dark:hover:bg-neutral-850/50'
                      }`}
                    >
                      <td className="py-3 px-4 font-sans font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                        <button className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <span>{group.key}</span>
                        <span className="text-[11px] text-neutral-400 font-normal">
                          ({formatPercent(shareOfRev)})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-700 dark:text-neutral-300">
                        {group.count}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(group.revenue, currency)}
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-500">
                        {formatCurrency(group.cost, currency)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-blue-600 dark:text-blue-400">
                        {formatCurrency(group.profit, currency)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatPercent(group.margin)}
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-700 dark:text-neutral-300">
                        {group.avgCsat.toFixed(1)} / 5.0
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-600 dark:text-neutral-400">
                        {formatCurrency(group.avgTicket, currency, true)}
                      </td>
                    </tr>

                    {/* Drill-down Child Rows when expanded */}
                    {isExpanded && (
                      <tr className="bg-neutral-50/40 dark:bg-neutral-950/40">
                        <td colSpan={8} className="p-0">
                          <div className="py-2 px-6 border-y border-neutral-100 dark:border-neutral-800">
                            <div className="text-[11px] font-sans font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                              Detalhamento de {group.items.length} contratos em "{group.key}":
                            </div>
                            <table className="w-full text-[11px] border-collapse mb-2">
                              <thead>
                                <tr className="text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                                  <th className="py-1.5 text-left font-normal">Data</th>
                                  <th className="py-1.5 text-left font-normal">Cliente</th>
                                  <th className="py-1.5 text-left font-normal">Produto / Solução</th>
                                  <th className="py-1.5 text-right font-normal">Receita</th>
                                  <th className="py-1.5 text-right font-normal">Custo</th>
                                  <th className="py-1.5 text-right font-normal">Margem</th>
                                  <th className="py-1.5 text-right font-normal">CSAT</th>
                                  <th className="py-1.5 text-center font-normal">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                                {group.items.map((sub) => (
                                  <tr key={sub.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40">
                                    <td className="py-1.5 text-neutral-400">{formatDate(sub.date)}</td>
                                    <td className="py-1.5 font-sans font-medium text-neutral-800 dark:text-neutral-200">{sub.client}</td>
                                    <td className="py-1.5 font-sans text-neutral-600 dark:text-neutral-400">{sub.product}</td>
                                    <td className="py-1.5 text-right text-neutral-900 dark:text-white font-medium">{formatCurrency(sub.revenue, currency)}</td>
                                    <td className="py-1.5 text-right text-neutral-400">{formatCurrency(sub.cost, currency)}</td>
                                    <td className="py-1.5 text-right text-emerald-600 dark:text-emerald-400">{formatPercent(sub.margin)}</td>
                                    <td className="py-1.5 text-right text-neutral-600 dark:text-neutral-400">{sub.csat.toFixed(1)}</td>
                                    <td className="py-1.5 text-center text-neutral-500 font-sans">{sub.status}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>

            {/* Grand Totals Footer */}
            <tfoot>
              <tr className="bg-neutral-100 dark:bg-neutral-850 font-bold border-t-2 border-neutral-300 dark:border-neutral-700 font-mono tabular-nums text-neutral-900 dark:text-white">
                <td className="py-3 px-4 font-sans">Total Geral Consolidado</td>
                <td className="py-3 px-3 text-right">{totalDeals}</td>
                <td className="py-3 px-3 text-right">{formatCurrency(totalRev, currency)}</td>
                <td className="py-3 px-3 text-right text-neutral-500">{formatCurrency(totalCost, currency)}</td>
                <td className="py-3 px-3 text-right text-blue-600 dark:text-blue-400">{formatCurrency(totalProfit, currency)}</td>
                <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400">{formatPercent(grandMargin)}</td>
                <td className="py-3 px-3 text-right">
                  {(groups.reduce((a, b) => a + b.avgCsat * b.count, 0) / (totalDeals || 1)).toFixed(1)}
                </td>
                <td className="py-3 px-3 text-right">
                  {formatCurrency(totalDeals > 0 ? totalRev / totalDeals : 0, currency, true)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};
