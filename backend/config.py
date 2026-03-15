import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/student_records')
DATABASE_NAME = 'student_records'

# Secret key for JWT
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

# Flask Configuration
DEBUG = True
PORT = 5000

