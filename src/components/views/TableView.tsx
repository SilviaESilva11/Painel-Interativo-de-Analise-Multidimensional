import React, { useState } from 'react';
import { DataRecord, CurrencyMode } from '../../types/data';
import { formatCurrency, formatNumber, formatPercent, formatDate } from '../../utils/formatters';
import { ArrowUpDown, Edit, Trash2, ChevronLeft, ChevronRight, Plus, Download, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

interface TableViewProps {
  data: DataRecord[];
  currency: CurrencyMode;
  onEditRecord: (record: DataRecord) => void;
  onDeleteRecord: (id: string) => void;
  onNewRecord: () => void;
  onExport: () => void;
}

type SortCol = keyof DataRecord;

export const TableView: React.FC<TableViewProps> = ({
  data,
  currency,
  onEditRecord,
  onDeleteRecord,
  onNewRecord,
  onExport,
}) => {
  const [sortCol, setSortCol] = useState<SortCol>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortCol];
    const valB = b[sortCol];
    const factor = sortDir === 'asc' ? 1 : -1;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * factor;
    }
    return String(valA).localeCompare(String(valB)) * factor;
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const pageStartIndex = (currentPage - 1) * pageSize;
  const pageData = sortedData.slice(pageStartIndex, pageStartIndex + pageSize);

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
    <div className="space-y-4">
      
      {/* Table Toolbar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
              Planilha de Registros & Base Transacional
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono tabular-nums">
              Exibindo {sortedData.length > 0 ? pageStartIndex + 1 : 0}–{Math.min(pageStartIndex + pageSize, sortedData.length)} de {sortedData.length} contratos filtrados
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <span>Linhas:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            <button
              onClick={onNewRecord}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Novo Registro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold select-none">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="py-3 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Data</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('client')}
                  className="py-3 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Cliente</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('product')}
                  className="py-3 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Produto</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="py-3 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Categoria</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('region')}
                  className="py-3 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Região</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('revenue')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Receita</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('margin')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Margem</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('volume')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('csat')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>CSAT</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-3 text-center whitespace-nowrap">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono tabular-nums">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-neutral-400 font-sans">
                    Nenhum registro encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                pageData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-neutral-400 font-semibold whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500 whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>
                    <td className="py-2.5 px-3 font-sans font-medium text-neutral-900 dark:text-white whitespace-nowrap">
                      {item.client}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                      {item.product}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-neutral-500 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-neutral-500 whitespace-nowrap">
                      {item.region}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(item.revenue, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {formatPercent(item.margin)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                      {formatNumber(item.volume)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                      {item.csat.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 font-sans text-xs text-neutral-700 dark:text-neutral-300">
                        {getStatusIcon(item.status)}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEditRecord(item)}
                          title="Editar Registro"
                          className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(item.id)}
                          title="Excluir Registro"
                          className="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-mono tabular-nums">
              Página {currentPage} de {totalPages}
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
