import { useState, useEffect } from 'react';
import { energyAPI } from '../services/api';
import KPICard from './KPICard';
import TimeSeriesChart from './TimeSeriesChart';
import Leaderboard from './Leaderboard';
import LoadingSpinner from './LoadingSpinner';
import DataGenerator from './DataGenerator';
import { KPICardSkeleton, ChartSkeleton } from './SkeletonLoader';
import { Activity, Zap, Home, TrendingUp, RefreshCw, Clock } from 'lucide-react';

const Dashboard = () => {
  const [todayData, setTodayData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [energySummary, setEnergySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchDashboardData(false); // Silent refresh
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      // Fetch today data first (fastest, shows KPIs immediately)
      const todayPromise = energyAPI.getTodayEnergy().then(data => {
        setTodayData(data);
        return data;
      }).catch(err => {
        console.error('Today data error:', err);
        return null;
      });
      
      // Fetch other data in parallel
      const [timeSeries, summary] = await Promise.all([
        energyAPI.aggregateEnergy({ interval: 'hour' }).catch(err => {
          console.error('Time series error:', err);
          return null;
        }),
        energyAPI.getEnergySummary().catch(err => {
          console.error('Summary error:', err);
          return null;
        })
      ]);
      
      // Wait for today data if not already set
      await todayPromise;
      
      setTimeSeriesData(timeSeries);
      setEnergySummary(summary);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error && !todayData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              TerraVolt Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                Auto-refresh
              </label>
              <button
                onClick={() => fetchDashboardData()}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            Real-time solar energy production monitoring across Africa
          </p>
          {lastRefresh && (
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {loading && !todayData ? (
            <>
              <KPICardSkeleton />
              <KPICardSkeleton />
              <KPICardSkeleton />
              <KPICardSkeleton />
            </>
          ) : (
            <>
              <KPICard
                title="Total Capacity"
                value={`${todayData?.total_power_mw || 0} MW`}
                icon={<Zap className="w-6 h-6" />}
                trend={null}
                color="bg-primary-600"
              />
              <KPICard
                title="Energy Today"
                value={`${todayData?.energy_today_mwh || 0} MWh`}
                icon={<Activity className="w-6 h-6" />}
                trend={null}
                color="bg-solar-600"
              />
              <KPICard
                title="Total Systems"
                value={todayData?.systems_total || 0}
                icon={<Home className="w-6 h-6" />}
                trend={null}
                color="bg-primary-600"
              />
              <KPICard
                title="Active Systems"
                value={todayData?.systems_active || 0}
                icon={<TrendingUp className="w-6 h-6" />}
                trend={null}
                color="bg-primary-700"
              />
            </>
          )}
        </div>

        {/* Energy Summary Stats */}
        {loading && !energySummary ? (
          <ChartSkeleton />
        ) : energySummary && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary-600" />
              <h3 className="text-xl font-bold text-gray-900">System Overview</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Total Energy Generated</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(energySummary.total_energy_kwh / 1000).toFixed(2)} MWh
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Total Power</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(energySummary.total_power_kw / 1000).toFixed(2)} MW
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {energySummary.total_records?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Avg Energy/Record</p>
                <p className="text-2xl font-bold text-gray-900">
                  {energySummary.average_energy_per_record?.toFixed(2) || 0} kWh
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Time Series Chart */}
          <div className="lg:col-span-2">
            {loading && !timeSeriesData ? (
              <ChartSkeleton />
            ) : (
              <TimeSeriesChart data={timeSeriesData} />
            )}
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>

        {/* Data Generator */}
        <div className="max-w-2xl">
          <DataGenerator />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

