# TerraVolt Frontend

A modern React-based dashboard for visualizing solar energy production across Kenya.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8000`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── Dashboard.jsx
│   │   ├── MapView.jsx
│   │   ├── KPICard.jsx
│   │   ├── TimeSeriesChart.jsx
│   │   ├── Leaderboard.jsx
│   │   └── ...
│   ├── services/          # API services
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Features

- **Real-time Dashboard**: KPI cards, system overview, auto-refresh every 30 seconds
- **Installations Management**: Search, filter, and view all solar installations
- **Performance Analytics**: CO₂ savings, cost analysis, uptime metrics with date ranges
- **Interactive Charts**: Time-series, bar charts, and pie charts using Recharts
- **Interactive Map**: Leaflet-based map with enhanced popups and info panels
- **Leaderboard**: Top performing installations ranked by energy output
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠 Tech Stack

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Chart library
- **Leaflet**: Interactive maps
- **Axios**: HTTP client
- **Lucide React**: Icon library

## 🔌 API Integration

The frontend communicates with the backend API at `/api/v1`. All endpoints utilized:

- `GET /api/v1/energy/today` - Dashboard KPIs
- `GET /api/v1/energy/aggregate` - Time series data
- `GET /api/v1/energy/leaderboard` - Top installations  
- `GET /api/v1/energy/stats/summary` - Overall statistics
- `GET /api/v1/energy/installations` - All installations
- `GET /api/v1/performance/metrics` - Performance analytics
- `GET /api/v1/map/installations` - Full map data (with fallback to mini)
- `GET /api/v1/map/installations_mini` - Lightweight map data
- `POST /api/v1/generate-data` - Generate simulated solar production data

## 🌍 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## 📱 Detailed Features

### Dashboard Page (`/`)

- Real-time KPI cards: Total Power, Energy Today, Systems
- System overview: Total energy, power, records, and averages
- Auto-refresh every 30 seconds with toggle
- Manual refresh button with last updated timestamp
- Time-series chart of hourly energy production
- Top 10 performing installations leaderboard
- **Data Generator**: Generate simulated solar production data for any number of days

### Installations Page (`/installations`)

- Summary statistics: Total, active, offline, and capacity
- Search functionality by name or location
- Filter by status (all, active, inactive, offline)
- Responsive grid of installation cards
- Detailed information for each installation

### Map Page (`/map`)

- Interactive Leaflet map with OpenStreetMap tiles
- Full data with current power and region information
- Automatic fallback to lightweight version
- Custom solar panel markers with size by capacity
- Enhanced popups with current status and timestamps
- Detailed info panel for selected installation
- Color-coded legend by capacity ranges

### Analytics Page (`/analytics`)

- Date range selector: 7, 30, 90 days, or 1 year
- Global KPIs: Energy, potential gain, CO₂ savings, cost savings
- Energy distribution pie chart
- System uptime visualization
- Performance by segment comparisons
- CO₂ and cost savings bar charts
- Per-installation metrics table

## 🎯 Performance

- Lazy loading of components
- API response caching
- Optimized re-renders with React hooks
- Compressed assets in production build

## ✨ Completed Features

- ✅ Real-time auto-refresh on dashboard
- ✅ Energy summary statistics
- ✅ Comprehensive installations management page
- ✅ Full performance analytics with date range selection
- ✅ Enhanced map with full and mini data support
- ✅ Fixed aggregate energy data structure
- ✅ All backend endpoints fully integrated
- ✅ **Data generator integration** - Generate realistic solar production data

## 🚧 Future Enhancements

- [ ] Regional filtering on map and analytics
- [ ] Export data as CSV/PDF
- [ ] Push notifications for alerts
- [ ] Dark mode support
- [ ] Individual installation detail pages
- [ ] Historical comparison views

## 📄 License

MIT License

