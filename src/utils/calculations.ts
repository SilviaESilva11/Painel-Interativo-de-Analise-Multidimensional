import { DataRecord, FilterState, MetricSummary, NumericField } from '../types/data';

export function filterRecords(data: DataRecord[], filters: FilterState): DataRecord[] {
  return data.filter((item) => {
    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const matchClient = item.client.toLowerCase().includes(q);
      const matchProduct = item.product.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      if (!matchClient && !matchProduct && !matchId && !matchCategory) {
        return false;
      }
    }

    // Region
    if (filters.region !== 'all' && item.region !== filters.region) {
      return false;
    }

    // Category
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }

    // Channel
    if (filters.channel !== 'all' && item.channel !== filters.channel) {
      return false;
    }

    // Status
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }

    // Date range
    if (filters.dateRange !== 'all') {
      const itemDate = new Date(item.date);
      const now = new Date('2026-10-07T00:00:00Z');

      if (filters.dateRange === '2026') {
        if (!item.date.startsWith('2026')) return false;
      } else if (filters.dateRange === '2025') {
        if (!item.date.startsWith('2025')) return false;
      } else if (filters.dateRange === '30days') {
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays < 0 || diffDays > 30) return false;
      } else if (filters.dateRange === '90days') {
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays < 0 || diffDays > 90) return false;
      } else if (filters.dateRange === 'q1-2026') {
        if (item.quarter !== 'Q1 2026') return false;
      } else if (filters.dateRange === 'q4-2025') {
        if (item.quarter !== 'Q4 2025') return false;
      }
    }

    // Revenue bounds
    if (filters.minRevenue !== undefined && item.revenue < filters.minRevenue) {
      return false;
    }
    if (filters.maxRevenue !== undefined && item.revenue > filters.maxRevenue) {
      return false;
    }

    return true;
  });
}

export function computeMetrics(data: DataRecord[]): MetricSummary {
  if (data.length === 0) {
    return {
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      avgMargin: 0,
      totalVolume: 0,
      avgCsat: 0,
      totalDeals: 0,
      avgTicket: 0,
      revenueTarget: 0,
      targetAchievement: 0,
    };
  }

  let totalRevenue = 0;
  let totalCost = 0;
  let totalVolume = 0;
  let sumCsat = 0;

  for (const item of data) {
    totalRevenue += item.revenue;
    totalCost += item.cost;
    totalVolume += item.volume;
    sumCsat += item.csat;
  }

  const totalProfit = totalRevenue - totalCost;
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const totalDeals = data.length;
  const avgTicket = totalDeals > 0 ? totalRevenue / totalDeals : 0;
  const avgCsat = totalDeals > 0 ? sumCsat / totalDeals : 0;

  // Realistic revenue target calculation based on data volume
  const revenueTarget = Math.round(totalRevenue * 1.08);
  const targetAchievement = revenueTarget > 0 ? (totalRevenue / revenueTarget) * 100 : 100;

  return {
    totalRevenue,
    totalCost,
    totalProfit,
    avgMargin,
    totalVolume,
    avgCsat,
    totalDeals,
    avgTicket,
    revenueTarget,
    targetAchievement,
  };
}

export interface PivotGroup {
  key: string;
  count: number;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  volume: number;
  avgCsat: number;
  avgTicket: number;
  items: DataRecord[];
}

export function computePivot(data: DataRecord[], groupBy: keyof DataRecord): PivotGroup[] {
  const map = new Map<string, DataRecord[]>();

  for (const item of data) {
    const keyVal = String(item[groupBy] ?? 'Outros');
    if (!map.has(keyVal)) {
      map.set(keyVal, []);
    }
    map.get(keyVal)!.push(item);
  }

  const groups: PivotGroup[] = [];
  map.forEach((items, key) => {
    let revenue = 0;
    let cost = 0;
    let volume = 0;
    let sumCsat = 0;

    for (const it of items) {
      revenue += it.revenue;
      cost += it.cost;
      volume += it.volume;
      sumCsat += it.csat;
    }

    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const avgCsat = items.length > 0 ? sumCsat / items.length : 0;
    const avgTicket = items.length > 0 ? revenue / items.length : 0;

    groups.push({
      key,
      count: items.length,
      revenue,
      cost,
      profit,
      margin,
      volume,
      avgCsat,
      avgTicket,
      items,
    });
  });

  // Sort descending by revenue
  return groups.sort((a, b) => b.revenue - a.revenue);
}

export interface TimeSeriesPoint {
  period: string; // e.g. "Jan 2026"
  timestamp: number;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  deals: number;
}

export function computeTimeSeries(data: DataRecord[]): TimeSeriesPoint[] {
  const map = new Map<string, { revenue: number; cost: number; deals: number; timestamp: number }>();

  for (const it of data) {
    const ym = it.date.slice(0, 7); // "YYYY-MM"
    if (!map.has(ym)) {
      const [year, month] = ym.split('-');
      const d = new Date(Number(year), Number(month) - 1, 1);
      map.set(ym, { revenue: 0, cost: 0, deals: 0, timestamp: d.getTime() });
    }
    const cur = map.get(ym)!;
    cur.revenue += it.revenue;
    cur.cost += it.cost;
    cur.deals += 1;
  }

  const sortedKeys = Array.from(map.keys()).sort();
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return sortedKeys.map((k) => {
    const val = map.get(k)!;
    const [y, m] = k.split('-');
    const label = `${monthNames[Number(m) - 1]} ${y.slice(2)}`;
    const profit = val.revenue - val.cost;
    const margin = val.revenue > 0 ? (profit / val.revenue) * 100 : 0;

    return {
      period: label,
      timestamp: val.timestamp,
      revenue: val.revenue,
      cost: val.cost,
      profit,
      margin,
      deals: val.deals,
    };
  });
}

// Pearson correlation coefficient (r)
export function computeCorrelation(
  data: DataRecord[],
  xField: NumericField,
  yField: NumericField
): { r: number; interpretation: string; xMean: number; yMean: number } {
  if (data.length < 2) {
    return { r: 0, interpretation: 'Dados insuficientes para correlação', xMean: 0, yMean: 0 };
  }

  const n = data.length;
  let sumX = 0;
  let sumY = 0;

  for (const d of data) {
    sumX += d[xField];
    sumY += d[yField];
  }

  const xMean = sumX / n;
  const yMean = sumY / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (const d of data) {
    const dx = d[xField] - xMean;
    const dy = d[yField] - yMean;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) {
    return { r: 0, interpretation: 'Sem variação suficiente', xMean, yMean };
  }

  const r = numerator / denominator;

  let interpretation = '';
  const absR = Math.abs(r);
  if (absR >= 0.8) {
    interpretation = r > 0 ? 'Forte correlação linear positiva' : 'Forte correlação linear negativa';
  } else if (absR >= 0.5) {
    interpretation = r > 0 ? 'Correlação positiva moderada' : 'Correlação negativa moderada';
  } else if (absR >= 0.2) {
    interpretation = r > 0 ? 'Correlação positiva fraca' : 'Correlação negativa fraca';
  } else {
    interpretation = 'Pouca ou nenhuma correlação linear detectada';
  }

  return { r, interpretation, xMean, yMean };
}
