import React, { useState } from 'react';
import { DataRecord } from '../types/data';
import { X, Copy, Check, FileDown, Code2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DataRecord[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
  const [copiedType, setCopiedType] = useState<'csv' | 'json' | null>(null);

  if (!isOpen) return null;

  const generateCSV = (): string => {
    const headers = [
      'id',
      'date',
      'client',
      'product',
      'category',
      'region',
      'channel',
      'revenue',
      'cost',
      'margin',
      'volume',
      'csat',
      'status',
      'quarter',
      'leadTimeDays',
    ];

    const rows = data.map((d) => [
      d.id,
      d.date,
      `"${d.client.replace(/"/g, '""')}"`,
      `"${d.product.replace(/"/g, '""')}"`,
      `"${d.category}"`,
      `"${d.region}"`,
      `"${d.channel}"`,
      d.revenue,
      d.cost,
      d.margin,
      d.volume,
      d.csat,
      `"${d.status}"`,
      `"${d.quarter}"`,
      d.leadTimeDays,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const generateJSON = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const handleDownloadCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pulse_analytics_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const jsonContent = generateJSON();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pulse_analytics_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (type: 'csv' | 'json') => {
    const content = type === 'csv' ? generateCSV() : generateJSON();
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Exportar Dados Analíticos
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5 font-mono tabular-nums">
              {data.length} registros selecionados prontos para extração
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          
          {/* CSV Card */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Planilha CSV (.csv)
                </h4>
                <p className="text-xs text-neutral-500">
                  Ideal para Excel, Google Sheets, PowerBI e ferramentas estatísticas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy('csv')}
                title="Copiar CSV"
                className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
              >
                {copiedType === 'csv' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownloadCSV}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors whitespace-nowrap"
              >
                Baixar CSV
              </button>
            </div>
          </div>

          {/* JSON Card */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Estrutura JSON (.json)
                </h4>
                <p className="text-xs text-neutral-500">
                  Formato nativo para desenvolvedores, APIs e integração com pipelines.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy('json')}
                title="Copiar JSON"
                className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
              >
                {copiedType === 'json' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownloadJSON}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors whitespace-nowrap"
              >
                Baixar JSON
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-850/80 border-t border-neutral-100 dark:border-neutral-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-750 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
