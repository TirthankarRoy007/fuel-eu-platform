import React from 'react';

const RoutesTab: React.FC = () => {
  // Placeholder data - we'll fetch this from the API later
  const mockRoutes = [
    { id: 'r001', name: 'R001', isBaseline: true, consumption: 100, intensity: 50.0 },
    { id: 'r002', name: 'R002', isBaseline: false, consumption: 150, intensity: 92.0 },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Routes Management</h2>
          <p className="text-slate-500 text-sm mt-1">Configure your shipping routes and set compliance baselines.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          + Add Route
        </button>
      </div>

      <div className="p-8">
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
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
              {mockRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{route.name}</td>
                  <td className="px-6 py-4 text-slate-600">{route.consumption}</td>
                  <td className="px-6 py-4 text-slate-600">{route.intensity} g/MJ</td>
                  <td className="px-6 py-4">
                    {route.isBaseline ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-tight">Baseline</span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                      {route.isBaseline ? 'Edit' : 'Set Baseline'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoutesTab;
