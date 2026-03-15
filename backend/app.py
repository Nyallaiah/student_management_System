from flask import Flask, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from config import MONGO_URI, DATABASE_NAME, SECRET_KEY, DEBUG, PORT

app = Flask(__name__)

# Configure CORS to allow frontend requests
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

# Configure MongoDB
app.config["MONGO_URI"] = MONGO_URI
app.config["SECRET_KEY"] = SECRET_KEY
app.config["DEBUG"] = DEBUG

# Initialize PyMongo
mongo = PyMongo(app)

# Import routes after mongo is initialized
from routes.student_routes import student_bp
from routes.auth_routes import auth_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(student_bp, url_prefix='/api/students')

# Make mongo available to routes
app.mongo = mongo

# Initialize database with default data
from models.student_model import init_db
with app.app_context():
    init_db()

# Root route
@app.route('/')
def index():
    return jsonify({'message': 'Student Record Management System API'})

# Health check route
@app.route('/api/health')
def health():
    try:
        # Test MongoDB connection
        mongo.db.command('ping')
        mongo_status = 'connected'
    except Exception as e:
        mongo_status = f'error: {str(e)}'
    
    return jsonify({
        'status': 'ok',
        'mongodb': mongo_status,
        'database': DATABASE_NAME
    })

if __name__ == '__main__':
    app.run(debug=DEBUG, port=PORT)

