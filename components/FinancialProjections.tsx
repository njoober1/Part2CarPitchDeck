import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, Line, Cell } from 'recharts';

interface FinancialProjectionsProps {
  onBack: () => void;
}

const data = [
  { year: '2026', agents: 35, agentRevenue: 0.52, otherRevenue: 0.28, globalRevenue: 0.80, expenses: 0.90, roi: -1, profit: -0.10, grossMargin: -12.5 },
  { year: '2027', agents: 75, agentRevenue: 0.76, otherRevenue: 1.54, globalRevenue: 2.30, expenses: 1.10, roi: 3, profit: 1.20, grossMargin: 52.2 },
  { year: '2028', agents: 125, agentRevenue: 1.88, otherRevenue: 4.32, globalRevenue: 6.20, expenses: 1.30, roi: 8, profit: 4.90, grossMargin: 79.0 },
  { year: '2029', agents: 175, agentRevenue: 2.62, otherRevenue: 4.90, globalRevenue: 7.52, expenses: 1.50, roi: 13, profit: 6.02, grossMargin: 80.1 },
  { year: '2030', agents: 225, agentRevenue: 3.38, otherRevenue: 5.20, globalRevenue: 8.58, expenses: 1.70, roi: 18, profit: 6.88, grossMargin: 80.2 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glassmorphism p-4 rounded-lg shadow-lg text-slate-200">
        <p className="font-bold text-lg mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.name === 'Agents' ? entry.value : `$${entry.value.toFixed(2)}M`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomROITooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glassmorphism p-4 rounded-lg shadow-lg text-slate-200">
        <p className="font-bold text-lg mb-2">{label}</p>
        <p style={{ color: payload[0].color }} className="text-sm">
          ROI: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const FinancialProjections: React.FC<FinancialProjectionsProps> = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-2 print:hidden no-print">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Financial Projections</h1>
            <button
              onClick={onBack}
              className="bg-[#517AE5] hover:bg-[#4367c6] text-white font-semibold py-2 px-6 rounded-lg transition-transform duration-200 hover:scale-105"
            >
              &larr; Back to Pitch Deck
            </button>
        </div>
        <div className="hidden print:block text-center mb-4">
            <h1 className="text-4xl font-bold text-slate-900">Financial Projections</h1>
        </div>
        <p className="text-slate-400 mb-8">5-Year Growth Strategy (2026-2030)</p>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glassmorphism rounded-lg p-6 border-l-4 border-[#517AE5]">
            <p className="text-slate-400 text-sm mb-1">Agent Growth</p>
            <p className="text-3xl font-bold text-white">35 &rarr; 225</p>
            <p className="text-green-500 text-sm mt-1">+543%</p>
          </div>
          <div className="glassmorphism rounded-lg p-6 border-l-4 border-green-500">
            <p className="text-slate-400 text-sm mb-1">Global Revenue Growth</p>
            <p className="text-3xl font-bold text-white">$0.80M &rarr; $8.58M</p>
            <p className="text-green-500 text-sm mt-1">+973%</p>
          </div>
          <div className="glassmorphism rounded-lg p-6 border-l-4 border-orange-500">
            <p className="text-slate-400 text-sm mb-1">Final ROI</p>
            <p className="text-3xl font-bold text-white">18%</p>
            <p className="text-green-500 text-sm mt-1">From -1% in 2026</p>
          </div>
          <div className="glassmorphism rounded-lg p-6 border-l-4 border-purple-500">
            <p className="text-slate-400 text-sm mb-1">2030 Profit</p>
            <p className="text-3xl font-bold text-white">$6.88M</p>
            <p className="text-green-500 text-sm mt-1">Net profit margin</p>
          </div>
        </div>

        {/* Global Revenue vs Expenses Chart */}
        <div className="glassmorphism rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-200 mb-4">Global Revenue vs Expenses</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="year" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" label={{ value: 'Amount ($M)', angle: -90, position: 'insideLeft', fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)' }} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
              <Legend wrapperStyle={{ color: '#E2E8F0', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', lineHeight: '2rem' }} />
              <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
              </defs>
              <Area type="monotone" dataKey="profit" fill="url(#colorProfit)" stroke="#10b981" fillOpacity={1} name="Profit" />
              <Line type="monotone" dataKey="globalRevenue" stroke="#a78bfa" strokeWidth={3} dot={{ r: 6 }} name="Global Revenue" />
              <Line type="monotone" dataKey="agentRevenue" stroke="#517AE5" strokeWidth={2} dot={{ r: 5 }} strokeDasharray="5 5" name="Agent Revenue" />
              <Line type="monotone" dataKey="otherRevenue" stroke="#facc15" strokeWidth={2} dot={{ r: 5 }} strokeDasharray="5 5" name="Other Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={3} dot={{ r: 6 }} name="Expenses" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown Chart */}
        <div className="glassmorphism rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-200 mb-4">Revenue Streams Breakdown</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="year" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" label={{ value: 'Amount ($M)', angle: -90, position: 'insideLeft', fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
              <Legend wrapperStyle={{ color: '#E2E8F0' }}/>
              <Bar dataKey="agentRevenue" stackId="a" fill="#517AE5" name="Agent Revenue" radius={[0, 0, 0, 0]} />
              <Bar dataKey="otherRevenue" stackId="a" fill="#f59e0b" name="Other Revenue" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Agent Growth Chart */}
          <div className="glassmorphism rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-200 mb-4">Agent Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="year" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                <Bar dataKey="agents" fill="#517AE5" name="Agents" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ROI Progression Chart */}
          <div className="glassmorphism rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-200 mb-4">ROI Progression</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="year" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft', fill: '#94A3B8' }} />
                <Tooltip content={<CustomROITooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                <Bar dataKey="roi" name="Net ROI" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.roi < 0 ? '#ef4444' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="glassmorphism rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-slate-200 mb-4">Detailed Projections</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-700">
                  <th className="text-left p-3 font-bold text-slate-300">Year</th>
                  <th className="text-right p-3 font-bold text-slate-300">Agents</th>
                  <th className="text-right p-3 font-bold text-[#517AE5]">Agent Revenue</th>
                  <th className="text-right p-3 font-bold text-amber-400">Other Revenue</th>
                  <th className="text-right p-3 font-bold text-purple-400">Global Revenue</th>
                  <th className="text-right p-3 font-bold text-slate-300">Expenses</th>
                  <th className="text-right p-3 font-bold text-slate-300">Profit</th>
                  <th className="text-right p-3 font-bold text-slate-300">Gross Margin</th>
                  <th className="text-right p-3 font-bold text-slate-300">ROI</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="p-3 font-semibold">{row.year}</td>
                    <td className="text-right p-3">{row.agents}</td>
                    <td className="text-right p-3 text-[#517AE5] font-semibold">${row.agentRevenue.toFixed(2)}M</td>
                    <td className="text-right p-3 text-amber-400 font-semibold">${row.otherRevenue.toFixed(2)}M</td>
                    <td className="text-right p-3 text-purple-400 font-bold">${row.globalRevenue.toFixed(2)}M</td>
                    <td className="text-right p-3 text-red-500 font-semibold">${row.expenses.toFixed(2)}M</td>
                    <td className="text-right p-3 font-semibold" style={{ color: row.profit >= 0 ? '#22c55e' : '#ef4444' }}>
                      ${row.profit.toFixed(2)}M
                    </td>
                    <td className="text-right p-3 font-bold" style={{ color: row.grossMargin >= 0 ? '#22c55e' : '#ef4444' }}>
                      {row.grossMargin.toFixed(1)}%
                    </td>
                    <td className="text-right p-3 font-bold" style={{ color: row.roi >= 0 ? '#22c55e' : '#ef4444' }}>
                      {row.roi}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-[#517AE5]/10 border-l-4 border-[#517AE5] p-4 mt-8 rounded">
          <p className="text-sm text-slate-300">
            <span className="font-bold">Note:</span> Agent revenue represents royalty fees per agent per year. Other revenue streams include additional business activities with consistent year-over-year growth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialProjections;