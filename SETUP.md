# Student Record System - Setup Guide

## Prerequisites

Before running the application, ensure you have the following installed:

1. **Node.js** (v14 or higher) - for the frontend
2. **Python** (v3.8 or higher) - for the backend
3. **MongoDB** - Either:
   - MongoDB Community Server (local installation)
   - MongoDB Atlas (cloud)

## Quick Start

### Option 1: Using the startup script
```bash
start.bat
```

### Option 2: Manual Startup

#### Step 1: Start MongoDB
- **Windows**: Start MongoDB service
  ```cmd
  net start MongoDB
  ```
- **MongoDB Atlas**: Ensure you have your connection string ready

#### Step 2: Configure Environment Variables
Create a `.env` file in the `backend` folder:
```env
MONGO_URI=mongodb://localhost:27017/student_records
SECRET_KEY=your-secret-key-change-in-production
```

#### Step 3: Start the Backend
```cmd
cd backend
pip install -r requirement
python app.py
```
The backend will run on `http://localhost:5000`

#### Step 4: Start the Frontend
```cmd
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`

## Testing the API

### Health Check
Open your browser or use curl:
```cmd
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "database": "student_records"
}
```

### Test Login
```cmd
curl -X POST http://localhost:5000/api/auth/login ^
-H "Content-Type: application/json" ^
-d "{\"email\":\"admin@gmail.com\",\"password\":\"admin123\"}"
```

### Test Add Student
```cmd
curl -X POST http://localhost:5000/api/students ^
-H "Content-Type: application/json" ^
-d "{\"name\":\"Test Student\",\"rollNumber\":\"TEST001\",\"email\":\"test@test.com\",\"department\":\"CSE\"}"
```

## Troubleshooting

### Error: `net::ERR_FAILED`
This is a network error indicating the backend is not reachable.

**Solutions:**
1. Check if Flask is running (look for terminal with backend output)
2. Verify MongoDB is running
3. Check if port 5000 is available: `netstat -ano | findstr 5000`

### Error: CORS Issues
If you see CORS errors in the browser console:
- Ensure CORS is properly configured in `backend/app.py`
- The frontend runs on port 5173 (Vite default)

### MongoDB Connection Issues
- Ensure MongoDB service is running: `sc query MongoDB`
- Check MongoDB connection string in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

## Default Login Credentials
- **Admin**: admin@gmail.com / admin123
- **Student**: student@gmail.com / student123

## Project Structure
```
student-record-system/
├── backend/
│   ├── app.py              # Flask application
│   ├── config.py           # Configuration
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── requirement         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios configuration
│   │   ├── pages/          # React pages
│   │   └── components/     # React components
│   └── package.json        # Node dependencies
└── start.bat               # Quick start script
```

