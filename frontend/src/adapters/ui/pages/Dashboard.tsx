import React, { useState } from 'react';
import RoutesTab from '../components/RoutesTab';
import CompareTab from '../components/CompareTab';
import BankingTab from '../components/BankingTab';
import PoolingTab from '../components/PoolingTab';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Routes');

  const tabs = [
    { name: 'Routes', icon: '🛣️' },
    { name: 'Compare', icon: '📊' },
    { name: 'Banking', icon: '🏦' },
    { name: 'Pooling', icon: '🤝' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Routes': return <RoutesTab />;
      case 'Compare': return <CompareTab />;
      case 'Banking': return <BankingTab />;
      case 'Pooling': return <PoolingTab />;
      default: return <RoutesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <h1 className="text-xl font-bold tracking-tight">Fuel-EU <span className="text-blue-600">Platform</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">v1.0.0-Beta</div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-6 p-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.name
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-slate-600 hover:bg-white hover:text-blue-600 border border-transparent hover:border-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
          <div className="h-full transition-opacity duration-300">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
