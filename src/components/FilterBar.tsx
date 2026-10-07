import React from 'react';
import { FilterState, Region, Category, Channel, ContractStatus } from '../types/data';
import { ALL_REGIONS, ALL_CATEGORIES, ALL_CHANNELS, ALL_STATUSES } from '../data/initialData';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  filteredCount,
  totalCount,
}) => {
  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.dateRange !== 'all' ||
    filters.region !== 'all' ||
    filters.category !== 'all' ||
    filters.channel !== 'all' ||
    filters.status !== 'all';

  const clearAll = () => {
    onChange({
      search: '',
      dateRange: 'all',
      region: 'all',
      category: 'all',
      channel: 'all',
      status: 'all',
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-3 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search bar & Record Counter */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar cliente, produto, ID (ex: Nubank, AI Engine, DAT-1001)..."
                value={filters.search}
                onChange={(e) => onChange({ ...filters, search: e.target.value })}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all"
              />
              {filters.search && (
                <button
                  onClick={() => onChange({ ...filters, search: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Unboxed metadata counter */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums whitespace-nowrap">
              <span>{filteredCount} exibidos</span>
              <span aria-hidden="true">/</span>
              <span>{totalCount} total</span>
            </div>
          </div>

          {/* Filter dropdown controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Filtros:</span>
            </div>

            {/* Date Range */}
            <select
              value={filters.dateRange}
              onChange={(e) => onChange({ ...filters, dateRange: e.target.value as FilterState['dateRange'] })}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
            >
              <option value="all">Todo o Período</option>
              <option value="2026">Ano 2026</option>
              <option value="2025">Ano 2025</option>
              <option value="90days">Últimos 90 Dias</option>
              <option value="30days">Últimos 30 Dias</option>
              <option value="q1-2026">Q1 2026</option>
              <option value="q4-2025">Q4 2025</option>
            </select>

            {/* Category */}
            <select
              value={filters.category}
              onChange={(e) => onChange({ ...filters, category: e.target.value as Category | 'all' })}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
            >
              <option value="all">Todas Categorias</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Region */}
            <select
              value={filters.region}
              onChange={(e) => onChange({ ...filters, region: e.target.value as Region | 'all' })}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
            >
              <option value="all">Todas Regiões</option>
              {ALL_REGIONS.map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>

            {/* Channel */}
            <select
              value={filters.channel}
              onChange={(e) => onChange({ ...filters, channel: e.target.value as Channel | 'all' })}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
            >
              <option value="all">Todos Canais</option>
              {ALL_CHANNELS.map((ch) => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={filters.status}
              onChange={(e) => onChange({ ...filters, status: e.target.value as ContractStatus | 'all' })}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
            >
              <option value="all">Todos Status</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
