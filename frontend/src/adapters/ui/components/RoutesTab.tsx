import React, { useEffect, useState, useMemo } from 'react';
import type { Route } from '../../../core/domain/types';
import { RouteService } from '../../../core/application/RouteService';
import { AxiosApiAdapter } from '../../infrastructure/AxiosApiAdapter';

const apiAdapter = new AxiosApiAdapter();
const routeService = new RouteService(apiAdapter);

const RoutesTab: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters state
  const [yearFilter, setYearFilter] = useState('2025');

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await routeService.fetchRoutes();
      setRoutes(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch routes. Ensure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleSetBaseline = async (id: string) => {
    try {
      await routeService.setBaseline(id);
      await loadRoutes(); // Refresh list
    } catch (err: any) {
      alert('Error setting baseline: ' + err.message);
    }
  };

  const filteredRoutes = useMemo(() => {
    // Note: In our current schema year is implicit or part of the record
    // We can extend this as the schema grows.
    return routes;
  }, [routes]);

  if (loading && routes.length === 0) {
    return <div className="p-8 text-center text-slate-500 italic">Loading routes...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header & Filters */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Routes Management</h2>
            <p className="text-slate-500 text-sm mt-1">Configure your shipping routes and set compliance baselines.</p>
          </div>
          <button 
            onClick={loadRoutes}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
          >
            Refresh
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Year</label>
            <select 
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-xs font-bold tracking-wider">
                <th className="px-6 py-4 border-b border-slate-200">Route Name</th>
                <th className="px-6 py-4 border-b border-slate-200">Fuel Cons. (t)</th>
                <th className="px-6 py-4 border-b border-slate-200">GHG Intensity</th>
                <th className="px-6 py-4 border-b border-slate-200">Status</th>
                <th className="px-6 py-4 border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No routes found for the selected criteria.</td>
                </tr>
              ) : (
                filteredRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{route.name}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono">{route.fuelConsumptionTonnes}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono">{route.ghgIntensity} g/MJ</td>
                    <td className="px-6 py-4">
                      {route.isBaseline ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-green-200">Baseline</span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {route.isBaseline ? (
                        <span className="text-slate-400 text-sm font-medium italic">Active</span>
                      ) : (
                        <button 
                          onClick={() => handleSetBaseline(route.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Set Baseline
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoutesTab;
