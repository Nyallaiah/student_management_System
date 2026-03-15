from flask import Blueprint, request, jsonify, current_app
import jwt
import datetime
from models.student_model import get_user_by_email, update_user_password

auth_bp = Blueprint('auth', __name__)

# Get secret key from app config
def get_secret_key():
    return current_app.config.get('SECRET_KEY', 'your-secret-key-change-in-production')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400
    
    # Find user in MongoDB
    user = get_user_by_email(email)
    
    if not user or user.get('password') != password:
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user['_id'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, get_secret_key(), algorithm='HS256')
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user['_id'],
            'email': user['email'],
            'role': user['role'],
            'name': user['name']
        }
    }), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    # In a real application, you might want to blacklist the token
    return jsonify({'success': True, 'message': 'Logout successful'}), 200

@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return jsonify({'success': False, 'message': 'No token provided'}), 401
    
    try:
        token = auth_header.split(' ')[1]
        decoded = jwt.decode(token, get_secret_key(), algorithms=['HS256'])
        return jsonify({
            'success': True,
            'user': decoded
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'success': False, 'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'success': False, 'message': 'Invalid token'}), 401

# Student Signup - Set own password
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    email = data.get('email')
    new_password = data.get('password')
    
    if not email or not new_password:
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400
    
    # Find user by email
    user = get_user_by_email(email)
    
    if not user:
        return jsonify({'success': False, 'message': 'No account found with this email. Please contact your administrator.'}), 404
    
    # Check if user is a student
    if user.get('role') != 'student':
        return jsonify({'success': False, 'message': 'Only students can sign up this way. Please use admin login.'}), 403
    
    # Check if user already verified (already set password)
    if user.get('is_verified', False):
        return jsonify({'success': False, 'message': 'You have already set your password. Please login directly.'}), 400
    
    # Update password
    success = update_user_password(email, new_password)
    
    if success:
        return jsonify({
            'success': True,
            'message': 'Password set successfully! You can now login with your email and password.'
        }), 200
    else:
        return jsonify({'success': False, 'message': 'Failed to set password. Please try again.'}), 500

