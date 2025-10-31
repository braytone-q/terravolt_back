import { Link } from 'react-router-dom';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  MapPin, 
  Activity,
  CheckCircle,
  ArrowRight,
  Globe,
  Leaf,
  Users,
  Award
} from 'lucide-react';
import { energyAPI } from '../services/api';
import { useState, useEffect } from 'react';

const Landing = () => {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live preview data
    const fetchLiveData = async () => {
      try {
        const data = await energyAPI.getTodayEnergy();
        setLiveData(data);
      } catch (err) {
        console.error('Failed to fetch live data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(22, 163, 74, 0.08) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(22, 163, 74, 0.08) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
              <Zap className="w-5 h-5 text-primary-600 animate-pulse" />
              <span className="text-primary-700 text-sm font-medium">Real-Time Solar Energy Monitoring</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Monitor, Analyze, and{' '}
              <span className="bg-gradient-to-r from-primary-600 to-solar-500 bg-clip-text text-transparent">
                Maximize
              </span>
              <br />
              Your Solar Energy Output
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              TerraVolt helps solar operators track performance, detect faults, and optimize energy efficiency across multiple installations in real-time.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/dashboard"
              className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              View Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/map"
              className="px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200"
            >
              Explore Map
            </Link>
          </div>

          {/* Live Data Preview Card */}
          {liveData && (
            <div className="mt-16 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                      <span className="text-primary-700 text-sm font-medium">Live Data</span>
                  </div>
                  <span className="text-gray-500 text-sm">Real-time</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Total Capacity</p>
                    <p className="text-2xl font-bold text-gray-900">{liveData.total_power_mw || 0} MW</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Energy Today</p>
                    <p className="text-2xl font-bold text-gray-900">{liveData.energy_today_mwh || 0} MWh</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Systems</p>
                    <p className="text-2xl font-bold text-gray-900">{liveData.systems_total || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Active</p>
                    <p className="text-2xl font-bold text-primary-600">{liveData.systems_active || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-2 bg-white/60">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The Challenge
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Solar monitoring is fragmented across multiple platforms</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Slow data processing delays critical decisions</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Expensive monitoring solutions lock out smaller operators</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>No centralized view of multi-site installations</span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The Solution
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p className="flex items-start gap-3">
                  <CheckCircle className="text-primary-600 mt-1 w-6 h-6 flex-shrink-0" />
                  <span><strong className="text-gray-900">TerraVolt</strong> centralizes data from multiple sites in one unified dashboard</span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle className="text-primary-600 mt-1 w-6 h-6 flex-shrink-0" />
                  <span>Real-time processing with <strong className="text-gray-900">sub-second latency</strong> for instant insights</span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle className="text-primary-600 mt-1 w-6 h-6 flex-shrink-0" />
                  <span>Scalable cloud architecture that <strong className="text-gray-900">grows with your operations</strong></span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle className="text-primary-600 mt-1 w-6 h-6 flex-shrink-0" />
                  <span>Intuitive visualization makes complex data <strong className="text-gray-900">easy to understand</strong></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-primary-600 to-solar-500 bg-clip-text text-transparent">
                Optimize Performance
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed for solar operators who demand precision and control
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.01]">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor energy production, power output, and system status across all installations with live updates every second.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.01]">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Fault Detection</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatic alerts for system anomalies, downtime events, and performance degradation before they impact revenue.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.01]">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Historical Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Deep insights into energy trends, performance patterns, and optimization opportunities with comprehensive reporting.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.01]">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Asset Visualization</h3>
              <p className="text-gray-600 leading-relaxed">
                Interactive maps and visual dashboards that show exactly where your installations are and how they're performing.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.01]">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Multi-Site Monitoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage hundreds of installations from a single dashboard, with role-based access and custom alerts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.01]">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Performance Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Identify underperforming systems, calculate potential gains, and optimize your energy output for maximum ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why TerraVolt?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for scale, designed for clarity, optimized for results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
                <Zap className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast & Accurate</h3>
              <p className="text-gray-600">
                Sub-second data processing with 99.9% uptime ensures you always have the latest information when you need it.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justifycenter w-20 h-20 bg-primary-100 rounded-full mb-6">
                <Shield className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cloud-Powered</h3>
              <p className="text-gray-600">
                Scalable cloud architecture that grows with your operations. No hardware, no maintenance, just results.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-solar-100 rounded-full mb-6">
                <Users className="w-10 h-10 text-solar-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multi-Site Ready</h3>
              <p className="text-gray-600">
                Manage installations across regions from one dashboard. Perfect for operators with distributed solar farms.
              </p>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Leaf className="w-8 h-8 text-primary-600" />
                <h3 className="text-3xl font-bold text-gray-900">Supporting Kenya's Clean Energy Future</h3>
              </div>
              <p className="text-gray-600 text-lg">
                TerraVolt is helping solar operators across Africa optimize their installations and maximize renewable energy output.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
                <div className="text-gray-600">Installations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-solar-600 mb-2">200+</div>
                <div className="text-gray-600">MWh Saved Daily</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-solar-600 mb-2">24/7</div>
                <div className="text-gray-600">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Solar Operations?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join operators who trust TerraVolt to monitor, analyze, and optimize their solar installations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="group px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/analytics"
              className="px-10 py-5 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200"
            >
              View Demo Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">TerraVolt</span>
              </div>
              <p className="text-gray-600 text-sm">
                Real-time solar energy monitoring and optimization platform for Africa.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Dashboard</Link></li>
                <li><Link to="/map" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Map View</Link></li>
                <li><Link to="/analytics" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Analytics</Link></li>
                <li><Link to="/installations" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Installations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">API Reference</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Support</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-700 transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} TerraVolt. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm mt-4 md:mt-0">
              Supporting Kenya's clean energy future
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

