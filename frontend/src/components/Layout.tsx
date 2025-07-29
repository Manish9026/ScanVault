import React from 'react';
import { Shield, Activity, FileText, AlertTriangle } from 'lucide-react';
import { useStats } from '../hooks/useStats';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { stats } = useStats(true, 10000);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ScanVault</h1>
                <p className="text-sm text-gray-500">Malware Scanner</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-4">
                <StatCard 
                  icon={FileText}
                  label="Total Files"
                  value={stats.total}
                  color="gray"
                />
                <StatCard 
                  icon={Activity}
                  label="Pending"
                  value={stats.pending}
                  color="warning"
                />
                <StatCard 
                  icon={Shield}
                  label="Clean"
                  value={stats.clean}
                  color="success"
                />
                <StatCard 
                  icon={AlertTriangle}
                  label="Infected"
                  value={stats.infected}
                  color="danger"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: 'gray' | 'warning' | 'success' | 'danger';
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    gray: 'text-gray-600 bg-gray-100',
    warning: 'text-warning-600 bg-warning-100',
    success: 'text-success-600 bg-success-100',
    danger: 'text-danger-600 bg-danger-100'
  };

  return (
    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50">
      <div className={`p-1 rounded ${colorClasses[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};