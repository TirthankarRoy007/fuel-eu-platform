import React, { useState } from 'react';
import RoutesTab from '../components/RoutesTab';
import CompareTab from '../components/CompareTab';
import BankingTab from '../components/BankingTab';
import PoolingTab from '../components/PoolingTab';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Routes');

  const tabs = ['Routes', 'Compare', 'Banking', 'Pooling'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Routes':
        return <RoutesTab />;
      case 'Compare':
        return <CompareTab />;
      case 'Banking':
        return <BankingTab />;
      case 'Pooling':
        return <PoolingTab />;
      default:
        return <RoutesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Fuel-EU Platform</span>
            </div>
            <div className="flex space-x-8 items-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white overflow-hidden shadow-xl rounded-lg">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
