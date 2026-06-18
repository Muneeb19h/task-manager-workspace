import React, { useState, useEffect } from 'react';
import { taskClient } from '../api/taskClient';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  FaChartPie,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaTasks,
} from 'react-icons/fa';

// Types matched cleanly with our two distinct endpoints
interface OverviewData {
  summary: {
    total_tasks: number;
    completed: number;
    in_progress: number;
    pending: number;
    overdue: number;
    overdue_count: number;
    completion_rate: number;
  };
  status_distribution: Array<{ name: string; value: number }>;
}

interface TrendNode {
  date: string;
  Completed: number;
  Overdue: number;
}

interface TrendsData {
  weekly_trends: TrendNode[];
  monthly_trends: TrendNode[];
}

interface TaskAnalyticsProps {
  darkMode?: boolean;
}

export const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ darkMode = true }) => {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [overviewResponse, trendsResponse] = await Promise.all([
          taskClient.get<OverviewData>('analytics/overview/'),
          taskClient.get<TrendsData>('analytics/trends/'),
        ]);

        setOverview(overviewResponse.data);
        setTrends(trendsResponse.data);
      } catch (err: unknown) {
        console.error('Failed to query analytics metrics:', err);
        setError('Could not access database metrics tracking.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 space-y-3">
        <FaSpinner className="animate-spin text-indigo-500 w-8 h-8" />
        <p className="text-xs font-medium font-mono">Aggregating system workspaces...</p>
      </div>
    );
  }

  if (error || !overview || !trends) {
    return (
      <div className="p-4 mx-auto max-w-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-2xl text-center my-6">
        {error || 'Data loading anomaly encountered.'}
      </div>
    );
  }

  const { summary, status_distribution } = overview;
  const activeTrendData = timeframe === 'weekly' ? trends.weekly_trends : trends.monthly_trends;

  // Custom colors for our dashboard status rings
  const PIE_COLORS = ['#fbbf24', '#38bdf8', '#34d399'];

  return (
    <div className="space-y-6 p-1">
      {/* 📊 Section Header */}
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
          <FaChartPie className="w-5 h-5" />
        </div>
        <div>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Workspace Metrics Dashboard</h2>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Data-driven performance insights for your collaborative items.
          </p>
        </div>
      </div>

      {/* 📈 High-Level Stat Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Registry */}
        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className={`text-[10px] font-mono uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Total Registry
            </p>
            <h3 className={`text-2xl font-black mt-1 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{summary.total_tasks}</h3>
          </div>
          <FaTasks className={`${darkMode ? 'text-slate-700' : 'text-slate-300'} w-5 h-5`} />
        </div>

        {/* Completed */}
        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-500">
              Completed
            </p>
            <h3 className={`text-2xl font-black mt-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{summary.completed}</h3>
          </div>
          <FaCheckCircle className={`${darkMode ? 'text-emerald-950' : 'text-emerald-200'} w-5 h-5`} />
        </div>

        {/* Efficiency Index */}
        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-500">
              Efficiency Index
            </p>
            <h3 className={`text-2xl font-black mt-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{summary.completion_rate}%</h3>
          </div>
          <div className={`text-xs font-bold font-mono ${darkMode ? 'text-indigo-500/30' : 'text-indigo-600/30'}`}>CR</div>
        </div>

        {/* Overdue Items */}
        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-rose-500">
              Overdue Items
            </p>
            <h3 className={`text-2xl font-black mt-1 ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>{summary.overdue_count}</h3>
          </div>
          <FaExclamationTriangle className={`${darkMode ? 'text-rose-950' : 'text-rose-200'} w-5 h-5`} />
        </div>
      </div>

      {/* 📉 Distribution Charts Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Breakdown (Takes 1 Columns) */}
        <div className={`p-5 rounded-2xl border lg:col-span-1 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h4 className={`text-xs font-black font-mono uppercase tracking-wider mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Task Status Breakdown
          </h4>
          <div className="h-64 w-full flex items-center justify-center">
            {summary.total_tasks === 0 ? (
              <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>No data context available.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={status_distribution.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {status_distribution.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                      borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                      borderRadius: '12px',
                      boxShadow: darkMode ? 'none' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    itemStyle={{ color: darkMode ? '#f1f5f9' : '#0f172a', fontSize: '12px' }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className={`text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 🌟 Line Trends Section (Takes up remaining 2 Columns) */}
        <div className={`p-5 rounded-2xl border lg:col-span-2 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className={`text-xs font-black font-mono uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Productivity Trends
            </h4>

            {/* Styled Timeframe Toggles */}
            <div className={`inline-flex p-1 rounded-xl border ${
              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  timeframe === 'weekly'
                    ? 'bg-indigo-600 text-white shadow'
                    : darkMode
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  timeframe === 'monthly'
                    ? 'bg-indigo-600 text-white shadow'
                    : darkMode
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            {summary.total_tasks === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>No trend context history found.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activeTrendData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                  <XAxis dataKey="date" stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} dy={10} />
                  <YAxis stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                      borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                      borderRadius: '12px',
                      color: darkMode ? '#f1f5f9' : '#0f172a',
                      boxShadow: darkMode ? 'none' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px' }}
                    formatter={(value) => (
                      <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{value}</span>
                    )}
                  />

                  {/* Completed Tasks Curve */}
                  <Line
                    type="monotone"
                    dataKey="Completed"
                    stroke="#34d399"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#34d399', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />

                  {/* Overdue Tasks Curve */}
                  <Line
                    type="monotone"
                    dataKey="Overdue"
                    stroke="#f87171"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#f87171', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
