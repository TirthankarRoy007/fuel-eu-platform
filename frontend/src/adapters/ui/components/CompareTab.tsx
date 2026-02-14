import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { ComparisonService } from '../../../core/application/ComparisonService';
import { AxiosApiAdapter } from '../../infrastructure/AxiosApiAdapter';
import type { Route } from '../../../core/domain/types';

const apiAdapter = new AxiosApiAdapter();
const comparisonService = new ComparisonService(apiAdapter);

const TARGET_INTENSITY = 89.3368;

const CompareTab: React.FC = () => {
  const [data, setData] = useState<{ baseline: Route | null; others: Route[] }>({ baseline: null, others: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await comparisonService.getComparison();
        setData(result);
      } catch (err) {
        console.error('Failed to load comparison data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const chartData = useMemo(() => {
    const baselineIntensity = data.baseline?.ghgIntensity;
    const all = data.baseline ? [data.baseline, ...data.others] : data.others;
    return all.map(r => ({
      id: r.id,
      name: r.name,
      intensity: r.ghgIntensity,
      isBaseline: r.isBaseline,
      percentDiff: ((r.ghgIntensity - TARGET_INTENSITY) / TARGET_INTENSITY) * 100,
      percentDiffBaseline: baselineIntensity ? ((r.ghgIntensity - baselineIntensity) / baselineIntensity) * 100 : null,
      compliant: r.ghgIntensity <= TARGET_INTENSITY
    }));
  }, [data]);

  if (loading) return <div className="p-8 text-center text-slate-500 italic">Loading comparison...</div>;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-2xl font-bold text-slate-800">Compliance Comparison</h2>
        <p className="text-slate-500 text-sm mt-1">Comparison of all routes against the 2025 target intensity ({TARGET_INTENSITY} g/MJ).</p>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Intensity Analysis (g/MJ)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [value.toFixed(2), 'Intensity']}
                />
                <ReferenceLine y={TARGET_INTENSITY} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Target', fill: '#ef4444', fontSize: 10 }} />
                <Bar dataKey="intensity" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.id}`} 
                      fill={entry.isBaseline ? '#3b82f6' : (entry.compliant ? '#4ade80' : '#f87171')} 
                      stroke={entry.isBaseline ? '#1d4ed8' : 'none'}
                      strokeWidth={2}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-wider justify-center">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-sm" /> Baseline</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-400 rounded-sm" /> Compliant</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-400 rounded-sm" /> Non-Compliant</div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Detailed Comparison</h3>
          <div className="overflow-hidden border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-4 py-3 border-b border-slate-200">Route</th>
                  <th className="px-4 py-3 border-b border-slate-200 text-center">Intensity</th>
                  <th className="px-4 py-3 border-b border-slate-200 text-center">vs Target</th>
                  <th className="px-4 py-3 border-b border-slate-200 text-center">vs Base</th>
                  <th className="px-4 py-3 border-b border-slate-200 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chartData.map((r) => (
                  <tr key={r.id} className={`hover:bg-slate-50 transition-colors ${r.isBaseline ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-4 py-4 font-semibold text-slate-700">
                      {r.name} {r.isBaseline && <span className="ml-2 text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase font-black">Base</span>}
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-xs text-slate-500">
                      {r.intensity.toFixed(2)}
                    </td>
                    <td className={`px-4 py-4 text-center font-mono text-xs ${r.percentDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {r.percentDiff > 0 ? '+' : ''}{r.percentDiff.toFixed(2)}%
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-xs text-slate-500">
                      {r.isBaseline ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        r.percentDiffBaseline !== null ? (
                          <span className={r.percentDiffBaseline > 0 ? 'text-red-400' : 'text-blue-400'}>
                            {r.percentDiffBaseline > 0 ? '+' : ''}{r.percentDiffBaseline.toFixed(1)}%
                          </span>
                        ) : 'N/A'
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {r.compliant ? (
                        <span className="text-green-600 font-bold text-[10px] flex items-center justify-end gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> COMPLIANT
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold text-[10px]">NON-COMPLIANT</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareTab;
