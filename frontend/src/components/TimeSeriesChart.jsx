import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const TimeSeriesChart = ({ data }) => {
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || !data.buckets) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.buckets.map(bucket => ({
    time: new Date(bucket.bucket_start).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    power: Math.round(bucket.avg_power_kw || 0),
    energy: (bucket.total_energy_kwh || 0).toFixed(2),
    timestamp: bucket.bucket_start,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Energy Production Timeline
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">Last 24 hours</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '10px' }} interval="preserveStartEnd" />
          <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line 
            type="monotone" 
            dataKey="power" 
            name="Power (kW)" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;

