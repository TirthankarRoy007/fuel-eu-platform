import React, { useEffect, useState } from 'react';
import { BankingService } from '../../../core/application/BankingService';
import { AxiosApiAdapter } from '../../infrastructure/AxiosApiAdapter';
import type { CBRecord, BankingRecord } from '../../../core/domain/types';

const apiAdapter = new AxiosApiAdapter();
const bankingService = new BankingService(apiAdapter);

const BankingTab: React.FC = () => {
  const [compliance, setCompliance] = useState<CBRecord | null>(null);
  const [bankedRecord, setBankedRecord] = useState<BankingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionResult, setActionResult] = useState<{cb_before: number, applied: number, cb_after: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shipId = 'SHIP001';
  const year = 2025;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cbData, bankData] = await Promise.all([
        bankingService.getCompliance(shipId, year),
        bankingService.getBankingRecord(shipId, year)
      ]);
      setCompliance(cbData);
      setBankedRecord(bankData);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch banking data. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBank = async () => {
    try {
      await bankingService.bankSurplus(shipId, year);
      await fetchData();
      setActionResult(null); // Reset result view
      alert("Surplus banked successfully!");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to bank surplus.");
    }
  };

  const handleApply = async () => {
    if (!bankedRecord || bankedRecord.amount <= 0) return;
    try {
      const result = await bankingService.applySurplus(shipId, year, bankedRecord.amount);
      setActionResult(result);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to apply surplus.");
    }
  };

  if (loading && !compliance) return <div className="p-8 text-center text-slate-500 italic">Loading banking data...</div>;

  const cb = compliance?.totalComplianceBalance || 0;
  const bankedAmount = (bankedRecord && typeof bankedRecord.amount === 'number') ? bankedRecord.amount : 0;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-2xl font-bold text-slate-800">Banking & Surplus Management</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your compliance balance surplus for future use.</p>
      </div>

      {error && (
        <div className="m-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
          <p className={`text-3xl font-black ${cb >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {cb.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            <span className="text-sm font-medium ml-1 text-slate-400">gCO2e</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Banked Surplus</p>
          <p className="text-3xl font-black text-blue-600">
            {bankedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            <span className="text-sm font-medium ml-1 text-slate-400">gCO2e</span>
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg shadow-slate-200 text-white flex flex-col justify-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Status</p>
           {cb >= 0 ? (
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
               <span className="font-bold text-sm">SURPLUS AVAILABLE</span>
             </div>
           ) : (
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-red-400 rounded-full" />
               <span className="font-bold text-sm">DEFICIT - ACTION REQUIRED</span>
             </div>
           )}
        </div>
      </div>

      <div className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Actions */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Banking Actions</h3>
            <p className="text-slate-500 text-sm mb-6">Bank your current surplus to use in future periods or apply existing banked amounts to cover a deficit.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleBank}
                disabled={cb <= 0}
                className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${
                  cb > 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Bank Surplus
              </button>
              
              <button 
                onClick={handleApply}
                disabled={bankedAmount <= 0}
                className={`flex-1 px-6 py-4 rounded-xl font-bold border-2 transition-all ${
                  bankedAmount > 0
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  : 'border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                Apply Banked
              </button>
            </div>
            {cb <= 0 && <p className="text-[10px] text-red-500 font-bold mt-3 uppercase tracking-wider">⚠️ Banking is disabled for deficits</p>}
          </div>
        </div>

        {/* Results / Details */}
        <div className="flex flex-col">
          {actionResult ? (
            <div className="bg-white border border-blue-100 rounded-3xl p-8 shadow-sm">
               <h3 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-6">Last Operation Result</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                   <span className="text-slate-500 font-medium">CB Before</span>
                   <span className="font-mono font-bold text-slate-700">{actionResult.cb_before.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                   <span className="text-slate-500 font-medium">Applied Amount</span>
                   <span className="font-mono font-bold text-blue-600">+{actionResult.applied.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-slate-800 font-bold">New CB Balance</span>
                   <span className={`font-mono font-black text-lg ${actionResult.cb_after >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {actionResult.cb_after.toLocaleString()}
                   </span>
                 </div>
               </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">📈</div>
              <p className="text-slate-400 font-medium max-w-[240px]">Perform an action to see the impact on your compliance balance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankingTab;
