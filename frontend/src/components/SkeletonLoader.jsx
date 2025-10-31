const SkeletonLoader = ({ count = 1, className = "" }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
        />
      ))}
    </>
  );
};

// Specific skeleton components
export const KPICardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
    <div className="h-8 bg-gray-200 rounded w-32"></div>
  </div>
);

export const InstallationCardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

export default SkeletonLoader;

