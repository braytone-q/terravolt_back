const KPICard = ({ title, value, icon, trend, color }) => {
  const trendColor = trend >= 0 ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} text-white`}>
          {icon}
        </div>
        {trend !== null && (
          <span className={`text-sm font-semibold ${trendColor}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      
      <h3 className="text-gray-500 text-sm font-medium mb-1">
        {title}
      </h3>
      
      <p className="text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};

export default KPICard;

