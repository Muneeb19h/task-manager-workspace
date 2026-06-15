import React, { useState, useEffect } from 'react';
import { taskClient } from '../api/taskClient';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {
  FaChartPie,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaTasks,
} from 'react-icons/fa';
import type { AnalyticsPayload } from '../types/component-props.types';

export const TaskAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // This automatically passes your auth headers via taskClient!
        const response = await taskClient.get<AnalyticsPayload>('analytics/');
        setData(response.data);
      } catch (err: unknown) {
        console.error('Failed to query system analytics metrics:', err);
        setError('Could not access database metrics tracking.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 space-y-3">
        <FaSpinner className="animate-spin text-indigo-500 w-8 h-8" />
        <p className="text-xs font-medium font-mono">Aggregating system workspaces...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 mx-auto max-w-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-2xl text-center">
        {error || 'Data loading anomaly encountered.'}
      </div>
    );
  }

  const { summary, status_distribution } = data;

  // Custom colors for our dashboard layout rings
  const COLORS = ['#fbbf24', '#38bdf8', '#34d399'];

  return (
    <div className="space-y-6 p-1">
      {/* 📊 Section Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
          <FaChartPie className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Workspace Metrics Dashboard</h2>
          <p className="text-xs text-slate-400">
            Data-driven performance insights for your collaborative items.
          </p>
        </div>
      </div>

      {/* 📈 High-Level Stat Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Total Registry
            </p>
            <h3 className="text-2xl font-black mt-1 text-slate-100">{summary.total_tasks}</h3>
          </div>
          <FaTasks className="text-slate-700 w-5 h-5" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-500">
              Completed
            </p>
            <h3 className="text-2xl font-black mt-1 text-emerald-400">{summary.completed}</h3>
          </div>
          <FaCheckCircle className="text-emerald-950 w-5 h-5" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-500">
              Efficiency Index
            </p>
            <h3 className="text-2xl font-black mt-1 text-indigo-400">{summary.completion_rate}%</h3>
          </div>
          <div className="text-xs font-bold font-mono text-indigo-500/30">CR</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-rose-500">
              Overdue Items
            </p>
            <h3 className="text-2xl font-black mt-1 text-rose-400">{summary.overdue_count}</h3>
          </div>
          <FaExclamationTriangle className="text-rose-950 w-5 h-5" />
        </div>
      </div>

      {/* Distribution Charts Layer */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h4 className="text-xs font-black font-mono uppercase tracking-wider text-slate-400 mb-4">
          Task Status Weight Configuration
        </h4>
        <div className="h-64 w-full flex items-center justify-center">
          {summary.total_tasks === 0 ? (
            <p className="text-xs text-slate-500">No data context available to graph.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={status_distribution.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {status_distribution.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                  }}
                  itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-slate-300 text-xs font-medium">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
