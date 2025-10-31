# TerraVolt Frontend - React Application

A modern, responsive React dashboard for monitoring solar energy production across Kenya.

## 🎯 Overview

The TerraVolt frontend is built with React 18 and provides a clean, interactive interface for:
- Real-time energy production monitoring
- Interactive visualization of solar installations on a map
- Performance analytics and leaderboards
- Historical data trends

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg              # TerraVolt logo
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard.jsx     # Main dashboard with KPIs and charts
│   │   ├── MapView.jsx       # Interactive map of installations
│   │   ├── KPICard.jsx       # Reusable KPI display card
│   │   ├── TimeSeriesChart.jsx # Energy production timeline
│   │   ├── Leaderboard.jsx   # Top installations ranking
│   │   ├── LoadingSpinner.jsx # Loading state component
│   │   └── Navbar.jsx        # Navigation bar
│   ├── services/
│   │   └── api.js            # API client with axios
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles (Tailwind)
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # Frontend documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running on http://localhost:8000

### Installation

```bash
cd frontend
npm install
```

### Configuration

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎨 Features

### Dashboard Page (`/`)
- **KPI Cards**: 
  - Total Power (MW)
  - Energy Today (MWh)
  - Total Systems
  - Active Systems
- **Time Series Chart**: Hourly energy production over last 24 hours
- **Leaderboard**: Top 10 performing installations

### Map Page (`/map`)
- **Interactive Leaflet Map**: All solar installations plotted
- **Custom Markers**: Color-coded by capacity
  - Green (dark): High capacity (>100 kW)
  - Green (medium): Medium capacity (50-100 kW)
  - Green (light): Small capacity (<50 kW)
- **Popup Details**: Installation name, capacity, status
- **Legend**: Visual guide for marker colors
- **Info Panel**: Detailed information for selected installation

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Recharts | Data visualization |
| Leaflet + React Leaflet | Interactive maps |
| Axios | HTTP client |
| Lucide React | Icon library |

## 📊 API Integration

The frontend communicates with the FastAPI backend through these endpoints:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/energy/today` | Dashboard KPIs |
| `GET /api/v1/energy/aggregate` | Time series data |
| `GET /api/v1/energy/leaderboard` | Top installations |
| `GET /api/v1/map/installations_mini` | Map data (GeoJSON) |

All API calls are centralized in `src/services/api.js` with:
- Automatic error handling
- Request/response interceptors
- Timeout configuration
- Proper error messages

## 🎨 Design System

### Colors
- **Primary Green**: `#22c55e` (Tailwind green-500)
- **Solar Orange**: `#f97316` (Tailwind orange-500)
- **Grays**: Various shades for text and backgrounds

### Typography
- **Headings**: Bold, large size
- **Body**: Regular weight, readable size
- **Labels**: Medium weight, smaller size

### Components
All components follow these patterns:
- Responsive design (mobile-first)
- Loading states
- Error handling
- Consistent spacing
- Smooth transitions

## 🔧 Configuration

### Vite
- Port: 5173
- Proxy: `/api` -> `http://localhost:8000`
- Fast refresh enabled

### Tailwind CSS
Custom theme with:
- Primary color palette (green)
- Solar color palette (orange)
- Extended utilities for common patterns

### ESLint
React-specific linting rules with warnings for:
- Missing key props
- Unused variables
- Best practices

## 📱 Responsive Design

The application is fully responsive:
- **Desktop** (> 1024px): Full layout with sidebar
- **Tablet** (768px - 1024px): Adjusted grid layout
- **Mobile** (< 768px): Stacked layout, optimized cards

## 🚀 Performance Optimizations

- Code splitting with React.lazy (ready for production)
- Memoization with React.memo
- Efficient re-renders with proper hooks usage
- CSS optimization with PurgeCSS in production
- Gzipped assets (configured in Vite)

## 🧪 Development Workflow

1. **Make changes** to components in `src/`
2. **Hot reload** automatically updates the browser
3. **Check linter**: `npm run lint`
4. **Test production build**: `npm run build`
5. **Commit changes** following conventional commits

## 🐛 Troubleshooting

### Backend Connection Issues
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check CORS settings in backend
# Allow: http://localhost:5173
```

### Map Not Loading
- Verify Leaflet CSS is loaded
- Check browser console for errors
- Ensure installations data is available

### Charts Not Rendering
- Check data format matches expected schema
- Verify Recharts is installed
- Check browser console for errors

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Examples](https://recharts.org/en-US/examples)
- [Leaflet Documentation](https://leafletjs.com/reference.html)

## 🤝 Contributing

See [GITHUB_CONTRIBUTING.md](./GITHUB_CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - See main project LICENSE file.

---

**Built with ❤️ by the TerraVolt Team**

