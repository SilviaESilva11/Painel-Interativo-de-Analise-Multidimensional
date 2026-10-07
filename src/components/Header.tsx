import React from 'react';
import { ViewMode, CurrencyMode } from '../types/data';
import { 
  BarChart3, 
  Table2, 
  MapPin, 
  ScatterChart, 
  LayoutDashboard, 
  Database, 
  Download, 
  Plus, 
  Sun, 
  Moon,
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  currency: CurrencyMode;
  onCurrencyChange: (c: CurrencyMode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenNewRecord: () => void;
  onOpenExport: () => void;
  onResetData: () => void;
  totalRecordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  currency,
  onCurrencyChange,
  isDark,
  onToggleTheme,
  onOpenNewRecord,
  onOpenExport,
  onResetData,
  totalRecordsCount,
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Visão Geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'charts', label: 'Gráficos Multivariados', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'pivot', label: 'Tabela Dinâmica', icon: <Table2 className="w-4 h-4" /> },
    { id: 'geo', label: 'Análise Territorial', icon: <MapPin className="w-4 h-4" /> },
    { id: 'correlation', label: 'Correlações', icon: <ScatterChart className="w-4 h-4" /> },
    { id: 'table', label: 'Dados Brutos', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-900 font-bold text-sm shadow-sm">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base tracking-tight text-neutral-900 dark:text-white">
                Pulse Analytics
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono tabular-nums leading-none">
                {totalRecordsCount} registros sincronizados
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links / Views */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-850'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Currency Selector */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60 text-xs">
              {(['BRL', 'USD', 'EUR'] as CurrencyMode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onCurrencyChange(c)}
                  className={`px-2 py-1 rounded font-medium transition-all ${
                    currency === c
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleTheme}
              title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              title="Restaurar dados originais"
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Export Button */}
            <button
              onClick={onOpenExport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            {/* Add Record CTA */}
            <button
              onClick={onOpenNewRecord}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Registro</span>
            </button>
          </div>
        </div>

        {/* Mobile View Selector Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-2.5 pt-1 border-t border-neutral-200/50 dark:border-neutral-800/50">
          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
