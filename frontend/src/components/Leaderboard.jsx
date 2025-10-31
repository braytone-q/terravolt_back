import { useState, useEffect } from 'react';
import { energyAPI } from '../services/api';
import { Award } from 'lucide-react';

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const result = await energyAPI.getLeaderboard({ limit: 10 });
      setData(result);
    } catch (error) {
      console.error('Leaderboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    const rank = index + 1;
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-900">Top Performers</h3>
      </div>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No data available</p>
        ) : (
          data.map((installation, index) => (
            <div 
              key={installation.installation_id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-lg font-bold text-gray-700 w-8">
                  {getRankIcon(index)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    Installation #{installation.installation_id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">
                  {(installation.total_energy_kwh || 0).toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">kWh</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

