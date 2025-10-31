# Contributing to TerraVolt Frontend

## Development Setup

1. Clone the repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Create `.env` file: `echo "VITE_API_URL=http://localhost:8000" > .env`
5. Start dev server: `npm run dev`

## Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components small and focused
- Add PropTypes or TypeScript types when needed

## Component Structure

```
components/
├── Dashboard.jsx      # Main dashboard page
├── KPICard.jsx       # Reusable KPI card component
├── Leaderboard.jsx   # Top installations list
├── LoadingSpinner.jsx # Loading state component
├── MapView.jsx       # Interactive map page
├── Navbar.jsx        # Navigation bar
└── TimeSeriesChart.jsx # Chart component
```

## API Integration

All API calls are centralized in `src/services/api.js`

To add a new endpoint:
1. Add the function to `energyAPI` object
2. Use it in components with proper error handling
3. Update loading states appropriately

## Testing

```bash
npm run lint          # Check code style
npm run build         # Test production build
```

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Run linter and build
5. Submit PR with clear description

## Common Tasks

### Adding a New Page

1. Create component in `src/components/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/Navbar.jsx`

### Adding a New Chart

1. Import Recharts components
2. Use ResponsiveContainer wrapper
3. Style consistently with existing charts
4. Add proper loading states

### Styling Guidelines

- Use Tailwind utility classes
- Follow existing color scheme (primary, solar)
- Maintain responsive design (mobile-first)
- Use consistent spacing (p-4, p-6, gap-4, etc.)

## Questions?

Contact the development team or open an issue on GitHub.

