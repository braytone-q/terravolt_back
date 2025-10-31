import { useState, useEffect } from 'react';
import { energyAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Award, TrendingUp, DollarSign, Leaf, Activity, Zap } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { KPICardSkeleton, ChartSkeleton } from './SkeletonLoader';

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(7); // days

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      // Set end date to now, start date to dateRange days ago
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      // Ensure we're using UTC and proper ISO format
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();
      
      console.log(`Fetching metrics for period: ${dateRange} days (${startISO} to ${endISO})`);
      
      const result = await energyAPI.getPerformanceMetrics({
        start: startISO,
        end: endISO
      });
      
      setMetrics(result);
      setError(null); // Clear any previous errors
    } catch (err) {
      // Better error handling
      if (err.message && err.message.includes('timeout')) {
        setError('Request timed out. Please try a shorter date range or check your connection.');
      } else if (err.message && err.message.includes('Network')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to fetch analytics');
      }
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show error banner but allow partial rendering
  if (error && !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchMetrics}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Retry
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Try selecting a shorter date range (e.g., 7 or 30 days) for faster loading.
          </p>
        </div>
      </div>
    );
  }

  if (!metrics || !metrics.global) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const global = metrics.global;
  const segments = metrics.segments || {};

  // Prepare data for charts
  const segmentData = Object.entries(segments).map(([name, data]) => ({
    name: name || 'Unknown',
    energy_kwh: data.energy_kwh || 0,
    potential_kwh: data.potential_kwh || 0,
    co2_savings: data.co2_savings_tons || 0,
    cost_savings: data.maintenance_avoided_cost || 0,
    uptime: data.uptime_percent || 0,
  }));

  const pieData = [
    { name: 'Energy Generated', value: global.energy_kwh || 0 },
    { name: 'Lost to Faults', value: global.kwh_lost_to_faults || 0 }
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Performance Analytics
            </h1>
            <p className="text-gray-600">
              Detailed insights and metrics across all installations
              {loading && <span className="ml-2 text-primary-600">(Loading...)</span>}
              {!loading && metrics && (
                <span className="ml-2 text-sm text-gray-500">
                  Showing data for last {dateRange} {dateRange === 1 ? 'day' : 'days'}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 font-medium">
              Period:
            </label>
            <select
              value={dateRange}
              onChange={(e) => {
                const newRange = Number(e.target.value);
                setDateRange(newRange);
                // Metrics will be refetched automatically via useEffect
              }}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-yellow-800 text-sm">{error}</p>
              <button
                onClick={fetchMetrics}
                className="text-yellow-800 hover:text-yellow-900 underline text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Global KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading && !metrics ? (
            <>
              <KPICardSkeleton />
              <KPICardSkeleton />
              <KPICardSkeleton />
              <KPICardSkeleton />
            </>
          ) : metrics && metrics.global ? (
            <>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary-600 text-white">
                <Zap className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Energy</h3>
            <p className="text-3xl font-bold text-gray-900">
              {global.energy_kwh?.toFixed(0) || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">kWh</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary-700 text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Potential Gain</h3>
            <p className="text-3xl font-bold text-gray-900">
              {global.relative_gain_percent?.toFixed(1) || 0}%
            </p>
            <p className="text-sm text-gray-500 mt-1">Optimization opportunity</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-solar-600 text-white">
                <Leaf className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">CO₂ Saved</h3>
            <p className="text-3xl font-bold text-gray-900">
              {global.co2_savings_tons?.toFixed(2) || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">tons</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Cost Saved</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${global.maintenance_avoided_cost?.toFixed(0) || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">USD</p>
          </div>
            </>
          ) : null}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Energy Generation vs Loss */}
          {loading && !metrics ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : metrics && metrics.global ? (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Energy Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* System Uptime */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">System Uptime</h3>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {global.uptime_percent?.toFixed(1) || 0}%
              </div>
              <p className="text-gray-500">Overall uptime</p>
            </div>
            <div className="mt-8 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Uptime Hours</span>
                  <span className="font-semibold">{global.total_uptime_hours?.toFixed(0) || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${global.uptime_percent || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
            </>
          ) : null}
        </div>

        {/* Segment Comparison */}
        {loading && !metrics ? (
          <ChartSkeleton />
        ) : segmentData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Performance by Segment</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={segmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="energy_kwh" fill="#22c55e" name="Energy Generated (kWh)" />
                <Bar dataKey="potential_kwh" fill="#86efac" name="Potential Energy (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* CO2 and Cost Savings by Segment */}
        {segmentData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">CO₂ Savings by Segment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={segmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="co2_savings" fill="#f97316" name="CO₂ Savings (tons)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Cost Savings by Segment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={segmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cost_savings" fill="#8b5cf6" name="Cost Savings ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Per-Installation Details */}
        {metrics.per_installation && metrics.per_installation.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Per-Installation Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Installation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Energy (kWh)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uptime
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CO₂ Saved
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.per_installation.slice(0, 10).map((inst, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{inst.installation_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inst.energy_kwh?.toFixed(0) || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inst.uptime_percent?.toFixed(1) || 0}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        {inst.co2_savings_tons?.toFixed(2) || 0} tons
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;

