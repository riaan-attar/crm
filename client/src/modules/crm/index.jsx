/**
 * CRM Dashboard — client/src/modules/crm/index.jsx
 * Mirrors Frappe CRM's dashboard layout with live context data.
 */
import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import './crm.css';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import EmptyChart from './EmptyChart';
import { useLeads } from '../../context/LeadsContext';
import { useOpportunities } from '../../context/OpportunitiesContext';

// ─── Date Parsing Helper ──────────────────────────────────────────────────────

const getRecordDate = (item) => {
  if (!item) return null;
  // Try createdOn first to respect back-dated seeded data
  if (item.createdOn) {
    if (typeof item.createdOn === 'string' && item.createdOn.includes('/')) {
      const parts = item.createdOn.split('/');
      const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      if (!isNaN(d.getTime())) return d;
    }
    const d = new Date(item.createdOn);
    if (!isNaN(d.getTime())) return d;
  }
  // Fallback to createdAt (always set by Sequelize)
  if (item.createdAt) {
    const d = new Date(item.createdAt);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

// ─── Dynamic Aggregation Helpers ──────────────────────────────────────────────

const filterByPeriod = (items, period) => {
  const now = new Date();
  let cutOffDate = null;
  
  if (period === 'Last Month') {
    cutOffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  } else if (period === 'Last Quarter') {
    cutOffDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  } else if (period === 'Last Year') {
    cutOffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  }
  
  if (!cutOffDate) return items; // All Time
  
  return items.filter(item => {
    const date = getRecordDate(item);
    return date && date >= cutOffDate && date <= now;
  });
};

const getDynamicChartData = (items, period, interval, filterFn = null) => {
  let filtered = filterByPeriod(items, period);
  if (filterFn) {
    filtered = filtered.filter(filterFn);
  }
  
  const now = new Date();
  const data = [];
  
  if (interval === 'Daily') {
    const daysToShow = period === 'Last Month' ? 30 : (period === 'Last Quarter' ? 15 : 7);
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const label = `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-US', { month: 'short' })}`;
      
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      
      const count = filtered.filter(item => {
        const date = getRecordDate(item);
        return date && date >= startOfDay && date <= endOfDay;
      }).length;
      
      data.push({ date: label, value: count });
    }
  } else if (interval === 'Weekly') {
    const weeksToShow = period === 'Last Year' ? 12 : (period === 'Last Quarter' ? 8 : 4);
    for (let i = weeksToShow - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const label = `${day}/${month}`;
      
      const windowStart = new Date(d.getTime() - 3.5 * 24 * 60 * 60 * 1000);
      const windowEnd = new Date(d.getTime() + 3.5 * 24 * 60 * 60 * 1000);
      
      const count = filtered.filter(item => {
        const date = getRecordDate(item);
        return date && date >= windowStart && date <= windowEnd;
      }).length;
      
      data.push({ date: label, value: count });
    }
  } else {
    // Monthly
    const monthsToShow = period === 'Last Quarter' ? 3 : (period === 'Last Month' ? 1 : 12);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
      
      const count = filtered.filter(item => {
        const date = getRecordDate(item);
        return date && date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear();
      }).length;
      
      data.push({ date: label, value: count });
    }
  }
  
  return data;
};

// ─── Shared Line Chart Component ──────────────────────────────────────────────

function BosLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <CartesianGrid vertical={false} stroke="#232323" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 13, fill: '#7c7c7c', fontFamily: 'Inter, sans-serif' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 'auto']}
          allowDecimals={false}
          tick={{ fontSize: 13, fill: '#7c7c7c', fontFamily: 'Inter, sans-serif' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#343434', borderRadius: '6px' }}
          itemStyle={{ color: '#f8f8f8' }}
          labelStyle={{ color: '#7c7c7c' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#e83e8c"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Specific Chart Components ────────────────────────────────────────────────

function TerritoryOpportunityChart({ data }) {
  if (data.length === 0) return <EmptyChart height={160} />;
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#232323" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7c7c7c' }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#7c7c7c' }} axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#343434', borderRadius: '6px' }}
          itemStyle={{ color: '#f8f8f8' }}
          labelStyle={{ color: '#7c7c7c' }}
        />
        <Bar dataKey="value" fill="#a352cc" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SourcePieChart({ data }) {
  if (data.length === 0) return <EmptyChart height={160} />;
  const COLORS = ['#a352cc', '#e83e8c', '#6f42c1', '#fd7e14', '#20c997'];
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="42%"
          innerRadius={35}
          outerRadius={55}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#343434', borderRadius: '6px' }}
          itemStyle={{ color: '#f8f8f8' }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={32} 
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '11px', color: '#7c7c7c' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function SalesBarChart({ data }) {
  if (data.length === 0) return <EmptyChart height={220} />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#232323" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7c7c7c' }} axisLine={false} tickLine={false} />
        <YAxis 
          tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
          tick={{ fontSize: 12, fill: '#7c7c7c' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip 
          formatter={(value) => [`₹${(value / 100000).toFixed(1)} Lakhs`, 'Deal Amount']}
          contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#343434', borderRadius: '6px' }}
          itemStyle={{ color: '#f8f8f8' }}
          labelStyle={{ color: '#7c7c7c' }}
        />
        <Bar dataKey="amount" fill="#20c997" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function LeadSourceChart({ data }) {
  if (data.length === 0) return <EmptyChart height={160} />;
  const COLORS = ['#fd7e14', '#007bff', '#28a745', '#e83e8c', '#6f42c1'];
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="42%"
          innerRadius={35}
          outerRadius={55}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#343434', borderRadius: '6px' }}
          itemStyle={{ color: '#f8f8f8' }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={32} 
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '11px', color: '#7c7c7c' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Section 1: Stat Cards ────────────────────────────────────────────────────

function StatCardsRow() {
  const { leads } = useLeads();
  const { opportunities } = useOpportunities();

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeOpps = Array.isArray(opportunities) ? opportunities : [];

  const newLeadsThisMonth = safeLeads.filter(l => {
    const d = getRecordDate(l);
    return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const newOppsThisMonth = safeOpps.filter(o => {
    const d = getRecordDate(o);
    return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const wonOpps = safeOpps.filter(o => o.status === 'Won').length;
  const openOpps = safeOpps.filter(
    o => !['Won', 'Lost'].includes(o.status)
  ).length;

  const STATS = [
    { title: 'New Lead (Last 1 Month)', value: newLeadsThisMonth },
    { title: 'New Opportunity (Last 1 Month)', value: newOppsThisMonth },
    { title: 'Won Opportunity (Last 1 Month)', value: wonOpps },
    { title: 'Open Opportunity', value: openOpps },
  ];

  return (
    <div
      className="crm-stat-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '16px',
      }}
    >
      {STATS.map((s) => (
        <StatCard key={s.title} title={s.title} value={s.value} />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CrmDashboard() {
  const { leads } = useLeads();
  const { opportunities } = useOpportunities();

  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeOpps = Array.isArray(opportunities) ? opportunities : [];

  // Filter States
  const [leadsPeriod, setLeadsPeriod] = useState('Last Quarter');
  const [leadsInterval, setLeadsInterval] = useState('Weekly');

  const [oppsPeriod, setOppsPeriod] = useState('Last Quarter');
  const [oppsInterval, setOppsInterval] = useState('Weekly');

  const [wonPeriod, setWonPeriod] = useState('Last Year');
  const [wonInterval, setWonInterval] = useState('Monthly');

  const [oppCountPeriod, setOppCountPeriod] = useState('All Time');
  const [sourcePeriod, setSourcePeriod] = useState('All Time');
  const [dealValPeriod, setDealValPeriod] = useState('All Time');
  const [leadSrcPeriod, setLeadSrcPeriod] = useState('All Time');

  // Dynamically calculated Line Chart datasets
  const leadsChartData = getDynamicChartData(safeLeads, leadsPeriod, leadsInterval);
  const oppsChartData = getDynamicChartData(safeOpps, oppsPeriod, oppsInterval);
  const wonChartData = getDynamicChartData(safeOpps, wonPeriod, wonInterval, (o) => o.status === 'Won');

  // Territory Wise Opportunity Count
  const filteredOppsForCount = filterByPeriod(safeOpps, oppCountPeriod);
  const areaCounts = {};
  filteredOppsForCount.forEach(o => {
    const area = o.preferredArea || 'Unknown';
    areaCounts[area] = (areaCounts[area] || 0) + 1;
  });
  const territoryData = Object.entries(areaCounts).map(([name, value]) => ({ name, value }));

  // Opportunities via Sources
  const filteredOppsForSource = filterByPeriod(safeOpps, sourcePeriod);
  const sourceCounts = {};
  filteredOppsForSource.forEach(o => {
    const source = o.source || 'Direct';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });
  const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

  // Territory Wise Deal Value (Total Deal Amount)
  const filteredOppsForDealVal = filterByPeriod(safeOpps, dealValPeriod);
  const territorySales = {};
  filteredOppsForDealVal.forEach(o => {
    const area = o.preferredArea || 'Unknown';
    const val = Number(o.amount) || 0;
    territorySales[area] = (territorySales[area] || 0) + val;
  });
  const salesData = Object.entries(territorySales).map(([name, amount]) => ({
    name,
    amount
  }));

  // Lead Source
  const filteredLeadsForSrc = filterByPeriod(safeLeads, leadSrcPeriod);
  const leadSourceCounts = {};
  filteredLeadsForSrc.forEach(l => {
    const source = l.leadSource || 'Direct';
    leadSourceCounts[source] = (leadSourceCounts[source] || 0) + 1;
  });
  const leadSourceData = Object.entries(leadSourceCounts).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ padding: '24px', fontFamily: 'var(--font-family)', backgroundColor: 'var(--bg-color)' }}>
      {/* Section 1 — Stat cards */}
      <StatCardsRow />

      {/* Section 2 — Full-width line charts */}
      <ChartCard
        title="Incoming Leads"
        showPeriod
        periodValue={leadsPeriod}
        onPeriodChange={setLeadsPeriod}
        showInterval
        intervalValue={leadsInterval}
        onIntervalChange={setLeadsInterval}
      >
        <BosLineChart data={leadsChartData} />
      </ChartCard>

      <ChartCard
        title="Opportunity Trends"
        showPeriod
        periodValue={oppsPeriod}
        onPeriodChange={setOppsPeriod}
        showInterval
        intervalValue={oppsInterval}
        onIntervalChange={setOppsInterval}
      >
        <BosLineChart data={oppsChartData} />
      </ChartCard>

      <ChartCard
        title="Won Opportunities"
        showPeriod
        periodValue={wonPeriod}
        onPeriodChange={setWonPeriod}
        showInterval
        intervalValue={wonInterval}
        onIntervalChange={setWonInterval}
      >
        <BosLineChart data={wonChartData} />
      </ChartCard>

      {/* Section 3 — 2-column chart cards */}
      <div
        className="crm-two-col"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <ChartCard 
          title="Territory Wise Opportunity Count" 
          showPeriod 
          periodValue={oppCountPeriod}
          onPeriodChange={setOppCountPeriod}
          style={{ marginBottom: 0 }}
        >
          <TerritoryOpportunityChart data={territoryData} />
        </ChartCard>
        <ChartCard 
          title="Opportunities via Sources" 
          showPeriod 
          periodValue={sourcePeriod}
          onPeriodChange={setSourcePeriod}
          style={{ marginBottom: 0 }}
        >
          <SourcePieChart data={sourceData} />
        </ChartCard>
      </div>

      {/* Section 4 — Full-width empty chart */}
      <ChartCard 
        title="Territory Wise Deal Value"
        showPeriod
        periodValue={dealValPeriod}
        onPeriodChange={setDealValPeriod}
      >
        <SalesBarChart data={salesData} />
      </ChartCard>

      {/* Section 5 — Half-width chart */}
      <div
        className="crm-half-col"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <ChartCard 
          title="Lead Source" 
          showPeriod 
          periodValue={leadSrcPeriod}
          onPeriodChange={setLeadSrcPeriod}
          style={{ marginBottom: 0 }}
        >
          <LeadSourceChart data={leadSourceData} />
        </ChartCard>
        <div /> {/* right side intentionally empty */}
      </div>
    </div>
  );
}
