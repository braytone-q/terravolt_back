import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import Analytics from './components/Analytics';
import Installations from './components/Installations';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Landing />
            </div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Dashboard />
            </div>
          }
        />
        <Route
          path="/map"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <MapView />
            </div>
          }
        />
        <Route
          path="/analytics"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Analytics />
            </div>
          }
        />
        <Route
          path="/installations"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Installations />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

