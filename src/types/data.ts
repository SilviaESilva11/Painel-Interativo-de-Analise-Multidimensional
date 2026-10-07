export type Region = 
  | 'Sudeste'
  | 'Sul'
  | 'Nordeste'
  | 'Centro-Oeste'
  | 'Norte'
  | 'Internacional (LATAM)';

export type Category = 
  | 'Software & SaaS'
  | 'Infraestrutura Cloud'
  | 'Inteligência Artificial'
  | 'Segurança da Informação'
  | 'Serviços Especializados';

export type Channel = 
  | 'Vendas Diretas Enterprise'
  | 'Parceiros & Integradores'
  | 'Inbound Marketing'
  | 'Expansão de Contas (Upsell)'
  | 'Contratos Governamentais';

export type ContractStatus = 
  | 'Concluído'
  | 'Em Execução'
  | 'Em Revisão'
  | 'Renovado'
  | 'Atrasado';

export interface DataRecord {
  id: string;
  date: string; // YYYY-MM-DD
  client: string;
  product: string;
  category: Category;
  region: Region;
  channel: Channel;
  revenue: number; // in BRL base
  cost: number; // in BRL base
  margin: number; // calculated percentage
  volume: number; // quantity/licenses
  csat: number; // 1.0 to 5.0
  status: ContractStatus;
  quarter: string; // e.g. "Q1 2026", "Q4 2025"
  leadTimeDays: number;
}

export type CurrencyMode = 'BRL' | 'USD' | 'EUR';

export type ViewMode = 
  | 'overview' 
  | 'charts' 
  | 'pivot' 
  | 'geo' 
  | 'correlation' 
  | 'table';

export interface FilterState {
  search: string;
  dateRange: 'all' | '2026' | '2025' | '90days' | '30days' | 'q1-2026' | 'q4-2025';
  region: Region | 'all';
  category: Category | 'all';
  channel: Channel | 'all';
  status: ContractStatus | 'all';
  minRevenue?: number;
  maxRevenue?: number;
}

export interface MetricSummary {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  avgMargin: number;
  totalVolume: number;
  avgCsat: number;
  totalDeals: number;
  avgTicket: number;
  revenueTarget: number;
  targetAchievement: number;
}

export type NumericField = 'revenue' | 'cost' | 'margin' | 'volume' | 'csat' | 'leadTimeDays';
