import React, { useState } from 'react';
import { DataRecord, Region, CurrencyMode } from '../../types/data';
import { ALL_REGIONS } from '../../data/initialData';
import { computePivot } from '../../utils/calculations';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { MapPin, Globe, Building2, Users } from 'lucide-react';

interface GeoViewProps {
  data: DataRecord[];
  currency: CurrencyMode;
  onFilterRegion?: (r: Region) => void;
}

export const GeoView: React.FC<GeoViewProps> = ({ data, currency, onFilterRegion }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>('Sudeste');

  const regionPivot = computePivot(data, 'region');
  const totalRevenue = data.reduce((acc, it) => acc + it.revenue, 0);

  const regionData = regionPivot.find((r) => r.key === selectedRegion) || {
    key: selectedRegion,
    count: 0,
    revenue: 0,
    cost: 0,
    profit: 0,
    margin: 0,
    volume: 0,
    avgCsat: 0,
    avgTicket: 0,
    items: [],
  };

  const selectedItems = data.filter((d) => d.region === selectedRegion);

  // Region details summary
  const regionDescriptions: Record<Region, { states: string; description: string; hub: string }> = {
    'Sudeste': {
      states: 'SP, RJ, MG, ES',
      description: 'Principal polo financeiro e corporativo de tecnologia da América Latina.',
      hub: 'São Paulo (Faria Lima / Chucri Zaidan) & Rio de Janeiro',
    },
    'Sul': {
      states: 'PR, SC, RS',
      description: 'Hub de excelência em manufatura avançada, agritech e polos de software em Florianópolis e Curitiba.',
      hub: 'Curitiba, Florianópolis & Porto Alegre',
    },
    'Nordeste': {
      states: 'BA, PE, CE, RN, PB, AL, SE, PI, MA',
      description: 'Ecossistema em rápida expansão tecnológica liderado pelo Porto Digital de Recife e centros de Fortaleza e Salvador.',
      hub: 'Recife (Porto Digital) & Fortaleza',
    },
    'Centro-Oeste': {
      states: 'DF, GO, MT, MS',
      description: 'Forte presença de contratos institucionais federais e operações de alta tecnologia agroindustrial.',
      hub: 'Brasília & Goiânia',
    },
    'Norte': {
      states: 'AM, PA, RO, AC, TO, AP, RR',
      description: 'Polo Industrial e Eletrônico da Zona Franca de Manaus e mineração tecnológica no Pará.',
      hub: 'PIM Manaus & Belém',
    },
    'Internacional (LATAM)': {
      states: 'Argentina, Chile, Colômbia, México, Uruguai',
      description: 'Operações multinacionais de tecnologia cruzada e expansão regional na América do Sul e México.',
      hub: 'Buenos Aires, Santiago, Bogotá & Cidade do México',
    },
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Análise Territorial & Inteligência Regional</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Performance de contratos segmentada por polos geográficos e hubs de inovação
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-500 tabular-nums">
            Total mapeado: {formatCurrency(totalRevenue, currency)}
          </div>
        </div>
      </div>

      {/* Grid: Territorial Map & Territory Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Territory Selector & Rankings List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1">
            Polos Regionais Classificados por Receita
          </div>

          {ALL_REGIONS.map((reg) => {
            const found = regionPivot.find((r) => r.key === reg);
            const rev = found ? found.revenue : 0;
            const count = found ? found.count : 0;
            const share = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
            const isSelected = selectedRegion === reg;

            return (
              <div
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-emerald-400 dark:text-emerald-600' : 'text-neutral-400'}`} />
                    <span className="font-semibold text-sm">{reg}</span>
                  </div>
                  <span className={`text-xs font-mono tabular-nums font-bold ${isSelected ? 'text-emerald-300 dark:text-emerald-700' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {formatPercent(share)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono tabular-nums opacity-90">
                  <span>{formatCurrency(rev, currency)}</span>
                  <span>{count} operações</span>
                </div>

                {/* Progress bar */}
                <div className={`mt-2.5 w-full h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-white/20 dark:bg-neutral-900/20' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
                  <div
                    className={`h-full rounded-full ${isSelected ? 'bg-emerald-400 dark:bg-emerald-600' : 'bg-neutral-900 dark:bg-neutral-100'}`}
                    style={{ width: `${share}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Region Detailed Diagnostic Card */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            {/* Header of Detail */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                  Diagnóstico Regional Ativo
                </span>
                <h4 className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                  {selectedRegion}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {regionDescriptions[selectedRegion]?.description}
                </p>
              </div>

              {onFilterRegion && (
                <button
                  onClick={() => onFilterRegion(selectedRegion)}
                  className="px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 transition-colors shrink-0"
                >
                  Filtrar todo o painel por {selectedRegion}
                </button>
              )}
            </div>

            {/* Quick Metrics of Region */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg">
                <span className="text-[11px] text-neutral-400 block">Receita Polo</span>
                <span className="text-base font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                  {formatCurrency(regionData.revenue, currency, true)}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg">
                <span className="text-[11px] text-neutral-400 block">Margem Média</span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {formatPercent(regionData.margin)}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg">
                <span className="text-[11px] text-neutral-400 block">Ticket Médio</span>
                <span className="text-base font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                  {formatCurrency(regionData.avgTicket, currency, true)}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg">
                <span className="text-[11px] text-neutral-400 block">CSAT Regional</span>
                <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                  {regionData.avgCsat.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            {/* Hub info */}
            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 bg-neutral-50 dark:bg-neutral-850/50 p-3 rounded-lg mb-5">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                <span><strong>Polos & Estados:</strong> {regionDescriptions[selectedRegion]?.states}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                <span><strong>Principais Centros:</strong> {regionDescriptions[selectedRegion]?.hub}</span>
              </div>
            </div>

            {/* Prominent Clients in this region */}
            <div>
              <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Principais Clientes e Operações em {selectedRegion} ({selectedItems.length}):
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {item.client}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {item.product} · {item.channel}
                      </div>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {formatCurrency(item.revenue, currency)}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        {formatPercent(item.margin)} margem
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
