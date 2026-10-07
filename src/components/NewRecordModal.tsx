import React, { useState, useEffect } from 'react';
import { DataRecord, Category, Region, Channel, ContractStatus } from '../types/data';
import { ALL_CATEGORIES, ALL_REGIONS, ALL_CHANNELS, ALL_STATUSES } from '../data/initialData';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { X, Check } from 'lucide-react';

interface NewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: DataRecord) => void;
  initialRecord?: DataRecord | null;
}

export const NewRecordModal: React.FC<NewRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRecord,
}) => {
  const [client, setClient] = useState('');
  const [product, setProduct] = useState('');
  const [category, setCategory] = useState<Category>('Software & SaaS');
  const [region, setRegion] = useState<Region>('Sudeste');
  const [channel, setChannel] = useState<Channel>('Vendas Diretas Enterprise');
  const [revenue, setRevenue] = useState(500000);
  const [cost, setCost] = useState(200000);
  const [volume, setVolume] = useState(1000);
  const [csat, setCsat] = useState(4.8);
  const [date, setDate] = useState('2026-10-01');
  const [status, setStatus] = useState<ContractStatus>('Concluído');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRecord) {
      setClient(initialRecord.client);
      setProduct(initialRecord.product);
      setCategory(initialRecord.category);
      setRegion(initialRecord.region);
      setChannel(initialRecord.channel);
      setRevenue(initialRecord.revenue);
      setCost(initialRecord.cost);
      setVolume(initialRecord.volume);
      setCsat(initialRecord.csat);
      setDate(initialRecord.date);
      setStatus(initialRecord.status);
    } else {
      setClient('');
      setProduct('');
      setCategory('Software & SaaS');
      setRegion('Sudeste');
      setChannel('Vendas Diretas Enterprise');
      setRevenue(450000);
      setCost(180000);
      setVolume(1200);
      setCsat(4.8);
      setDate('2026-10-01');
      setStatus('Concluído');
    }
    setError('');
  }, [initialRecord, isOpen]);

  if (!isOpen) return null;

  const calculatedProfit = revenue - cost;
  const calculatedMargin = revenue > 0 ? (calculatedProfit / revenue) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim()) {
      setError('Por favor, informe o nome do cliente corporativo.');
      return;
    }
    if (!product.trim()) {
      setError('Por favor, especifique a solução ou produto contratado.');
      return;
    }
    if (revenue <= 0) {
      setError('A receita deve ser maior que zero.');
      return;
    }

    const quarterLabel = date.startsWith('2026')
      ? Number(date.split('-')[1]) <= 3
        ? 'Q1 2026'
        : Number(date.split('-')[1]) <= 6
        ? 'Q2 2026'
        : Number(date.split('-')[1]) <= 9
        ? 'Q3 2026'
        : 'Q4 2026'
      : 'Q4 2025';

    const newRecord: DataRecord = {
      id: initialRecord ? initialRecord.id : `DAT-${Math.floor(1200 + Math.random() * 8800)}`,
      date,
      client: client.trim(),
      product: product.trim(),
      category,
      region,
      channel,
      revenue: Number(revenue),
      cost: Number(cost),
      margin: Math.round(calculatedMargin * 10) / 10,
      volume: Number(volume),
      csat: Number(csat),
      status,
      quarter: quarterLabel,
      leadTimeDays: initialRecord ? initialRecord.leadTimeDays : Math.floor(12 + Math.random() * 28),
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {initialRecord ? 'Editar Operação / Contrato' : 'Adicionar Nova Operação ao Painel'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Todos os indicadores e gráficos do painel serão recalculados instantaneamente.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Nome do Cliente
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Nubank Tech, Vale Digital..."
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Produto / Solução
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Enterprise AI Engine..."
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Polo Regional
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {ALL_REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Canal de Aquisição
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as Channel)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {ALL_CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Status Operacional
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContractStatus)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Receita Bruta (R$)
              </label>
              <input
                type="number"
                min="1000"
                step="5000"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono tabular-nums bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Custo de Entrega (R$)
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono tabular-nums bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Volume / Licenças
              </label>
              <input
                type="number"
                min="1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono tabular-nums bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Índice CSAT (1.0 a 5.0)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={csat}
                onChange={(e) => setCsat(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono tabular-nums bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Data do Registro
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Real-time calculated indicators */}
            <div className="flex flex-col justify-end">
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-mono tabular-nums">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                  <span>Lucro Estimado:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(calculatedProfit, 'BRL')}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-300 mt-1">
                  <span>Margem Calculada:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatPercent(calculatedMargin)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{initialRecord ? 'Salvar Alterações' : 'Criar Registro'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
