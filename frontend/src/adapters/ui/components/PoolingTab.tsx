import React, { useEffect, useState, useMemo } from 'react';
import { PoolService } from '../../../core/application/PoolService';
import { AxiosApiAdapter } from '../../infrastructure/AxiosApiAdapter';
import type { Pool } from '../../../core/domain/types';

const apiAdapter = new AxiosApiAdapter();
const poolService = new PoolService(apiAdapter);

const MOCK_SHIP_IDS = ['SHIP-ALPHA', 'SHIP-BETA', 'SHIP-GAMMA'];

const PoolingTab: React.FC = () => {
  const [ships, setShips] = useState<Array<{id: string, cb: number}>>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [poolName, setPoolName] = useState('New Compliance Pool');
  const [pools, setPools] = useState<Pool[]>([]);

  const year = 2025;

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch adjusted CB for our mock ships
      // To make them different in this demo, we'll apply some modifiers
      const results = await Promise.all(MOCK_SHIP_IDS.map(async (id, idx) => {
        const data = await poolService.getAdjustedCompliance(id, year);
        // Add some variation based on index for the demo
        const baseCB = data.totalComplianceBalance;
        const modifiers = [1.2, -0.8, 0.5];
        return {
          id,
          cb: baseCB * (modifiers[idx] || 1)
        };
      }));
      setShips(results);
      
      const existingPools = await poolService.getPools();
      setPools(existingPools);
    } catch (err) {
      console.error("Failed to fetch pooling data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleShip = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const poolSummary = useMemo(() => {
    const selected = ships.filter(s => selectedIds.includes(s.id));
    const totalCB = selected.reduce((sum, s) => sum + s.cb, 0);
    const isValid = selected.length >= 2 && totalCB >= 0;
    
    return {
      totalCB,
      isValid,
      count: selected.length
    };
  }, [ships, selectedIds]);

  const handleCreatePool = async () => {
    if (!poolSummary.isValid) return;
    
    try {
      const members = ships
        .filter(s => selectedIds.includes(s.id))
        .map(s => ({ shipId: s.id, cbBefore: s.cb }));
        
      await poolService.createPool(poolName, year, members);
      alert("Pool created successfully!");
      setSelectedIds([]);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to create pool.");
    }
  };

  if (loading && ships.length === 0) return <div className="p-8 text-center text-slate-500 italic">Loading pooling data...</div>;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-2xl font-bold text-slate-800">Ship Pooling</h2>
        <p className="text-slate-500 text-sm mt-1">Combine surpluses and deficits across multiple vessels to achieve compliance.</p>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Available Vessels</h3>
            <span className="text-xs text-slate-400 font-medium">{selectedIds.length} vessels selected</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ships.map(ship => (
              <button
                key={ship.id}
                onClick={() => toggleShip(ship.id)}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  selectedIds.includes(ship.id)
                  ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    selectedIds.includes(ship.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    🚢
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight ${
                    ship.cb >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {ship.cb >= 0 ? 'Surplus' : 'Deficit'}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800">{ship.id}</h4>
                <p className={`text-xl font-black mt-1 ${ship.cb >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ship.cb.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <span className="text-xs font-medium ml-1 opacity-60">gCO2e</span>
                </p>
              </button>
            ))}
          </div>

          {/* Existing Pools */}
          {pools.length > 0 && (
            <div className="mt-12">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Active Pools</h3>
              <div className="space-y-3">
                {pools.map(pool => (
                  <div key={pool.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-700">{pool.name}</p>
                      <p className="text-xs text-slate-400">{pool.members.length} members • {pool.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-blue-600">+{pool.totalCB.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Pooled Balance</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Configuration & Summary */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-24">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Pool Configuration</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Pool Name</label>
                <input 
                  type="text" 
                  value={poolName}
                  onChange={(e) => setPoolName(e.target.value)}
                  className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">Total Pooled Balance</span>
                  <span className={`font-mono font-bold ${poolSummary.totalCB >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {poolSummary.totalCB.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
                  <div 
                    className={`h-full transition-all duration-500 ${poolSummary.totalCB >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: poolSummary.count > 0 ? '100%' : '0%' }}
                  />
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full ${poolSummary.count >= 2 ? 'bg-green-500' : 'bg-slate-600'}`} />
                    <span className={poolSummary.count >= 2 ? 'text-slate-200' : 'text-slate-500'}>At least 2 vessels selected</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full ${poolSummary.totalCB >= 0 ? 'bg-green-500' : 'bg-slate-600'}`} />
                    <span className={poolSummary.totalCB >= 0 ? 'text-slate-200' : 'text-slate-500'}>Net positive compliance balance</span>
                  </div>
                </div>

                <button
                  onClick={handleCreatePool}
                  disabled={!poolSummary.isValid}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    poolSummary.isValid
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Create Compliance Pool
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolingTab;
