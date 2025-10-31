import { useState } from 'react';
import { energyAPI } from '../services/api';
import { Zap, PlayCircle, CheckCircle, AlertCircle } from 'lucide-react';

const DataGenerator = () => {
  const [numDays, setNumDays] = useState(7);
  const [selectedInstallations, setSelectedInstallations] = useState([]);
  const [allInstallations, setAllInstallations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [numInstallations, setNumInstallations] = useState(1000);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const requestData = {
        num_days: numDays,
      };

      if (selectedInstallations.length > 0) {
        requestData.installation_ids = selectedInstallations;
      }

      const response = await energyAPI.generateData(requestData);
      setResult(response);
      
      // Refresh dashboard data after successful generation
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to generate data');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInstallations = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await energyAPI.generateInstallations({ num_installations: numInstallations });
      setResult(response);
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to generate installations');
      console.error('Installation generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Installation Generator */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary-600 text-white">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Generate Installations</h3>
            <p className="text-sm text-gray-500">Create solar installations across Africa</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Number of Installations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Installations
            </label>
            <select
              value={numInstallations}
              onChange={(e) => setNumInstallations(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            >
              <option value={10}>10 installations</option>
              <option value={50}>50 installations</option>
              <option value={100}>100 installations</option>
              <option value={500}>500 installations</option>
              <option value={1000}>1000 installations</option>
            </select>
          </div>

          {/* Generate Button */}
        <button
            onClick={handleGenerateInstallations}
            disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Creating Installations...
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                Generate Installations
              </>
            )}
          </button>

          {/* Info */}
          {!loading && (
            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-sm text-primary-700">
                <strong>Note:</strong> This will create {numInstallations} new solar installations across various African cities with realistic capacities and locations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Production Data Generator */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-solar-600 text-white">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Generate Solar Data</h3>
            <p className="text-sm text-gray-500">Create simulated production data</p>
          </div>
        </div>

        <div className="space-y-4">
        {/* Number of Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Days
          </label>
          <select
            value={numDays}
            onChange={(e) => setNumDays(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          >
            <option value={1}>1 day</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <PlayCircle className="w-5 h-5" />
              Generate Data
            </>
          )}
        </button>

        {/* Result Display */}
        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-green-900 mb-2">{result.message}</p>
                <div className="space-y-1 text-sm text-green-700">
                  {result.records_generated && (
                    <>
                      <p>• Records Generated: {result.records_generated}</p>
                      <p>• Days: {result.days}</p>
                    </>
                  )}
                  {result.installations_created && (
                    <>
                      <p>• Installations Created: {result.installations_created}</p>
                      <p>• Total Capacity: {result.total_capacity_mw} MW</p>
                    </>
                  )}
                  {result.owner_type_distribution && (
                    <div className="mt-2">
                      <p className="font-semibold">Distribution:</p>
                      <ul className="list-disc list-inside ml-2">
                        {Object.entries(result.owner_type_distribution).map(([type, count]) => (
                          <li key={type}>{type}: {count}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.installation_names && result.installation_names.length > 0 && (
                    <div>
                      <p className="font-semibold mt-2">Installations:</p>
                      <ul className="list-disc list-inside ml-2">
                        {result.installation_names.map((name, idx) => (
                          <li key={idx}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm text-primary-700">
            <strong>Note:</strong> This will generate simulated solar production data for all installations 
            based on realistic weather patterns, temperature effects, and system characteristics. 
            The data includes hourly production values for the specified number of days.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DataGenerator;

