/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { initialData } from './data/initialData';
import { DataRecord, ViewMode, CurrencyMode, FilterState, Region } from './types/data';
import { filterRecords, computeMetrics } from './utils/calculations';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MetricCards } from './components/MetricCards';
import { OverviewView } from './components/views/OverviewView';
import { ChartsView } from './components/views/ChartsView';
import { PivotView } from './components/views/PivotView';
import { GeoView } from './components/views/GeoView';
import { CorrelationView } from './components/views/CorrelationView';
import { TableView } from './components/views/TableView';
import { NewRecordModal } from './components/NewRecordModal';
import { ExportModal } from './components/ExportModal';

const STORAGE_KEY = 'pulse_analytics_records_v1';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Currency selection
  const [currency, setCurrency] = useState<CurrencyMode>('BRL');

  // Active view
  const [currentView, setCurrentView] = useState<ViewMode>('overview');

  // Main dataset with local storage backing
  const [records, setRecords] = useState<DataRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback to initialData
    }
    return initialData;
  });

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: 'all',
    region: 'all',
    category: 'all',
    channel: 'all',
    status: 'all',
  });

  // Modal states
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataRecord | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Persist records
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // storage unavailable or quota exceeded
    }
  }, [records]);

  // Calculate filtered dataset
  const filteredRecords = useMemo(() => {
    return filterRecords(records, filters);
  }, [records, filters]);

  // Compute metrics in real-time
  const metrics = useMemo(() => {
    return computeMetrics(filteredRecords);
  }, [filteredRecords]);

  // Handlers
  const handleSaveRecord = (record: DataRecord) => {
    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === record.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = record;
        return next;
      }
      return [record, ...prev];
    });
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Tem certeza de que deseja remover esta operação do painel?')) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleEditRecord = (record: DataRecord) => {
    setEditingRecord(record);
    setIsNewRecordOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar a base de dados original de 120 operações verificadas?')) {
      setRecords(initialData);
      setFilters({
        search: '',
        dateRange: 'all',
        region: 'all',
        category: 'all',
        channel: 'all',
        status: 'all',
      });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleFilterRegionFromGeo = (region: Region) => {
    setFilters((prev) => ({ ...prev, region }));
    setCurrentView('overview');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:text-emerald-200">
      
      {/* Top Bar Contract (Wordmark, Nav Links/Views, Actions) */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        currency={currency}
        onCurrencyChange={setCurrency}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onOpenNewRecord={() => {
          setEditingRecord(null);
          setIsNewRecordOpen(true);
        }}
        onOpenExport={() => setIsExportOpen(true)}
        onResetData={handleResetData}
        totalRecordsCount={records.length}
      />

      {/* Global Interactive Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        filteredCount={filteredRecords.length}
        totalCount={records.length}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Real-time KPI Metric Cards */}
        <MetricCards metrics={metrics} currency={currency} />

        {/* View Switcher Container */}
        <div className="mt-6">
          {currentView === 'overview' && (
            <OverviewView
              data={filteredRecords}
              metrics={metrics}
              currency={currency}
              onSelectClient={(client) => {
                setFilters((prev) => ({ ...prev, search: client }));
              }}
              onViewAllTable={() => setCurrentView('table')}
            />
          )}

          {currentView === 'charts' && (
            <ChartsView
              data={filteredRecords}
              currency={currency}
            />
          )}

          {currentView === 'pivot' && (
            <PivotView
              data={filteredRecords}
              currency={currency}
            />
          )}

          {currentView === 'geo' && (
            <GeoView
              data={filteredRecords}
              currency={currency}
              onFilterRegion={handleFilterRegionFromGeo}
            />
          )}

          {currentView === 'correlation' && (
            <CorrelationView
              data={filteredRecords}
              currency={currency}
            />
          )}

          {currentView === 'table' && (
            <TableView
              data={filteredRecords}
              currency={currency}
              onEditRecord={handleEditRecord}
              onDeleteRecord={handleDeleteRecord}
              onNewRecord={() => {
                setEditingRecord(null);
                setIsNewRecordOpen(true);
              }}
              onExport={() => setIsExportOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-xs text-neutral-500 dark:text-neutral-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono tabular-nums">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">Pulse Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Painel Multidimensional Interativo</span>
            <span aria-hidden="true">·</span>
            <span>{records.length} registros no banco</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Base temporal: 2025–2026</span>
            <span aria-hidden="true">·</span>
            <span>Atualização instantânea</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewRecordModal
        isOpen={isNewRecordOpen}
        onClose={() => {
          setIsNewRecordOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        initialRecord={editingRecord}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={filteredRecords}
      />

    </div>
  );
}
