import { useState, useEffect } from 'react';
import { energyAPI } from '../services/api';
import { MapPin, Zap, Activity, TrendingUp, Search, X, Info } from 'lucide-react';

import LoadingSpinner from './LoadingSpinner';
import { InstallationCardSkeleton, KPICardSkeleton } from './SkeletonLoader';
import { Link } from 'react-router-dom';

const Installations = () => {
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [todayData, setTodayData] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [detailsData, setDetailsData] = useState([]);
  const [total, setTotal] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchInstallations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on mount

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      // Fetch stats first (quick), then installations
      const todayPromise = energyAPI.getTodayEnergy();
      const installationsPromise = energyAPI.getInstallations({
        skip: (page - 1) * pageSize,
        limit: 1000 // Get all for client-side filtering/pagination
      });
      
      // Fetch today data first for quick stats display
      try {
        const today = await todayPromise;
        setTodayData(today || null);
        setStatsLoading(false);
      } catch (err) {
        console.error('Stats error:', err);
        setStatsLoading(false);
      }
      
      // Then fetch installations
      const instData = await installationsPromise;
      if (instData && instData.installations) {
        setInstallations(instData.installations || []);
        setTotal(instData.total || instData.installations.length);
      } else {
        // Fallback for old API format
        setInstallations(Array.isArray(instData) ? instData : []);
        setTotal(Array.isArray(instData) ? instData.length : 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch installations');
      console.error('Installations error:', err);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  const onOpenDetails = async (installation) => {
    setSelectedInstallation(installation);
    setDetailsError(null);
    setDetailsLoading(true);
    try {
      const data = await energyAPI.getEnergyByInstallation(installation.id);
      setDetailsData(Array.isArray(data) ? data : []);
    } catch (e) {
      setDetailsError(e.message || 'Failed to load installation details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const onCloseDetails = () => {
    setSelectedInstallation(null);
    setDetailsData([]);
    setDetailsError(null);
  };

  const formatNumber = (n) =>
    typeof n === 'number' && !Number.isNaN(n) ? n.toLocaleString() : n;

  const computeDetails = () => {
    if (!detailsData || detailsData.length === 0) return { latest: null, energy24: 0 };
    // Sort newest first
    const sorted = [...detailsData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    // Prefer latest daytime (06:00-18:00) non-zero power; fall back to absolute latest
    let preferred = sorted.find((r) => {
      const h = new Date(r.timestamp).getHours();
      return h >= 6 && h < 18 && (Number(r.power_kw) || 0) > 0;
    }) || sorted[0];
    // Energy last 24 readings as a quick approximation of last day
    const last24 = sorted.slice(0, 24);
    const energy24 = last24.reduce((s, r) => s + (Number(r.energy_kwh) || 0), 0);
    return { latest: preferred, energy24 };
  };

  const filteredInstallations = installations.filter(inst => {
    const matchesSearch = inst.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.location_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inst.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Reset to first page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus]);

  const totalItems = filteredInstallations.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedInstallations = filteredInstallations.slice(startIndex, startIndex + pageSize);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchInstallations}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    total: todayData?.systems_total ?? installations.length,
    active: todayData?.systems_active ?? installations.filter(i => i.status === 'active').length,
    offline: (() => {
      const total = todayData?.systems_total ?? installations.length;
      const active = todayData?.systems_active ?? installations.filter(i => i.status === 'active').length;
      return Math.max(0, total - active);
    })(),
    // Use backend-calculated total capacity from API for consistency with Dashboard
    // Convert from MW to kW, then back to MW for display (to match Dashboard format)
    totalCapacity: todayData?.total_power_mw ? (todayData.total_power_mw * 1000) : installations.reduce((sum, i) => sum + (i.capacity_kw || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Solar Installations
          </h1>
          <p className="text-gray-600">
            Manage and monitor all solar energy installations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            <>
              <KPICardSkeleton />
              <KPICardSkeleton />
              <KPICardSkeleton />
              <KPICardSkeleton />
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary-600 text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary-600 text-white">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Active</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary-800 text-white">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Offline</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.offline}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-solar-600 text-white">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Capacity</h3>
            <p className="text-3xl font-bold text-gray-900">
              {todayData?.total_power_mw !== undefined 
                ? todayData.total_power_mw 
                : (stats.totalCapacity / 1000).toFixed(1)}
            </p>
            <p className="text-sm text-gray-500 mt-1">MW</p>
              </div>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Installations List */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            All Installations ({filteredInstallations.length})
          </h3>

          {filteredInstallations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No installations found</p>
          ) : (
            <>
              {/* Pagination header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <p className="text-sm text-gray-600">
                  Showing {Math.min(totalItems, startIndex + 1)}–{Math.min(totalItems, startIndex + pagedInstallations.length)} of {totalItems}
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Per page</label>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {loading && pagedInstallations.length === 0 ? (
                  <>
                    <InstallationCardSkeleton />
                    <InstallationCardSkeleton />
                    <InstallationCardSkeleton />
                    <InstallationCardSkeleton />
                    <InstallationCardSkeleton />
                    <InstallationCardSkeleton />
                  </>
                ) : (
                  pagedInstallations.map((installation) => (
                <div
                  key={installation.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onOpenDetails(installation)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                        {installation.name || `Installation #${installation.id}`}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {installation.location_name || 'Unknown'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        installation.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {installation.status || 'unknown'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Capacity
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {installation.capacity_kw?.toFixed(0) || 0} kW
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Owner Type
                      </span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">
                        {installation.owner_type || 'Unknown'}
                      </span>
                    </div>
                    {installation.location_lat && installation.location_lng && (
                      <div className="text-xs text-gray-500 mt-3">
                        📍 {installation.location_lat.toFixed(4)}, {installation.location_lng.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
                  ))
                )}
              </div>

              {/* Pagination footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="inline-flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedInstallation && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={onCloseDetails} />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-xl border-l border-gray-200 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-gray-900">Installation Details</h3>
              </div>
              <button
                onClick={onCloseDetails}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close details"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Header block */}
              <div className="mb-4">
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedInstallation.name || `Installation #${selectedInstallation.id}`}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedInstallation.location_name}</span>
                </div>
              </div>

              {/* Quick facts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Capacity</p>
                  <p className="text-lg font-semibold text-gray-900">{formatNumber((selectedInstallation.capacity_kw || 0).toFixed(0))} kW</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-sm font-semibold">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      (selectedInstallation.status || '').toLowerCase() === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedInstallation.status || 'unknown'}
                    </span>
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Owner Type</p>
                  <p className="text-lg font-semibold capitalize text-gray-900">{selectedInstallation.owner_type}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Coordinates</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedInstallation.location_lat?.toFixed(4)}, {selectedInstallation.location_lng?.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Live metrics */}
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Recent Metrics</h5>
                {detailsLoading ? (
                  <div className="text-sm text-gray-500">Loading details...</div>
                ) : detailsError ? (
                  <div className="text-sm text-red-600">{detailsError}</div>
                ) : (
                  (() => {
                    const { latest, energy24 } = computeDetails();
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Latest Power</p>
                          <p className="text-lg font-bold text-gray-900">{latest ? `${(latest.power_kw || 0).toFixed(2)} kW` : '—'}</p>
                          {latest && (
                            <p className="text-xs text-gray-500 mt-1">{new Date(latest.timestamp).toLocaleString()}</p>
                          )}
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Energy (last 24h)</p>
                          <p className="text-lg font-bold text-gray-900">{energy24.toFixed(2)} kWh</p>
                        </div>
                        {latest && (
                          <div className="p-4 border border-gray-200 rounded-lg sm:col-span-2">
                            <p className="text-xs text-gray-500 mb-1">Weather</p>
                            <p className="text-sm font-semibold text-gray-900 capitalize">{latest.weather || 'unknown'}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={onCloseDetails}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Installations;

