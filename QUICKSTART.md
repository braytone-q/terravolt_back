# TerraVolt - Quick Start Guide

## Prerequisites

- **Node.js 18+** and npm
- **Python 3.9+** and pip
- **PostgreSQL** database
- **Redis** server

## 🚀 Getting Started

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv environment
source environment/bin/activate  # On Windows: environment\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Redis (if not running)
redis-server

# Start PostgreSQL (if not running)
sudo systemctl start postgresql  # On Linux

# Start backend server
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# OR use the provided script:
./start.sh
```

The frontend will be available at `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to:
- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📊 Features Available

### Dashboard Page
- Real-time energy production metrics
- Time-series charts
- Top performing installations leaderboard

### Map Page
- Interactive map showing all solar installations
- Click markers for detailed information
- Color-coded by capacity

## 🔧 Troubleshooting

### Backend Issues

**Issue**: Connection to PostgreSQL failed
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection string in .env file
# Should be: postgresql://user:password@localhost:5432/TerraVolt
```

**Issue**: Redis connection failed
```bash
# Start Redis
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:7
```

### Frontend Issues

**Issue**: Cannot connect to backend API
```bash
# Check VITE_API_URL in frontend/.env
# Should be: http://localhost:8000

# Make sure backend is running on port 8000
```

**Issue**: Port 5173 already in use
```bash
# Use a different port
npm run dev -- --port 3000
```

## 🐳 Docker Setup (Alternative)

If you prefer using Docker:

```bash
cd backend
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis server
- FastAPI backend
- Celery worker
- Celery beat

## 📝 Environment Variables

### Backend (.env in backend/)
```
DATABASE_URL=postgresql://user:password@localhost:5432/TerraVolt
REDIS_URL=redis://localhost:6379/0
```

### Frontend (.env in frontend/)
```
VITE_API_URL=http://localhost:8000
```

## 🎯 Next Steps

1. **Seed the database** with sample installations and data
2. **Configure Celery** for scheduled data generation
3. **Customize the UI** colors and branding
4. **Add more visualizations** as needed

## 📚 Additional Resources

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the project README files
3. Check API docs at `/docs`
4. Contact the development team

---

**Happy Coding! 🌍⚡**

