from flask import Blueprint, request, jsonify, current_app
import jwt
import datetime
from models.student_model import (
    get_all_students,
    get_student_by_id,
    get_student_by_email,
    create_student,
    update_student,
    delete_student,
    create_user_from_student,
    get_user_by_email,
    get_student_marks,
    update_student_marks,
    get_student_by_roll_number
)

# Get secret key from app config
def get_secret_key():
    return current_app.config.get('SECRET_KEY', 'your-secret-key-change-in-production')

student_bp = Blueprint('students', __name__)

# Get all students
@student_bp.route('', methods=['GET'])
def get_all_students_route():
    try:
        students = get_all_students()
        return jsonify({
            'success': True,
            'students': students,
            'count': len(students)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Get student by ID
@student_bp.route('/<string:student_id>', methods=['GET'])
def get_student_route(student_id):
    student = get_student_by_id(student_id)
    
    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 404
    
    return jsonify({
        'success': True,
        'student': student
    }), 200

# Create new student
@student_bp.route('', methods=['POST'])
def create_student_route():
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    # Validate required fields
    required_fields = ['name', 'rollNumber', 'email', 'department']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'message': f'{field} is required'}), 400
    
    # Check if email already exists in students collection
    if get_student_by_email(data['email']):
        return jsonify({'success': False, 'message': 'Email already exists'}), 400
    
    # Check if user already exists in users collection
    existing_user = get_user_by_email(data['email'])
    if existing_user:
        return jsonify({'success': False, 'message': 'User with this email already exists'}), 400
    
    # Check if roll number already exists
    if get_student_by_roll_number(data['rollNumber']):
        return jsonify({'success': False, 'message': 'Roll number already exists'}), 400
    
    # Create new student in MongoDB
    new_student = create_student(data)
    
    # Create user account with temporary password
    user_account = create_user_from_student(new_student)
    
    if user_account:
        return jsonify({
            'success': True,
            'message': 'Student created successfully',
            'student': new_student,
            'credentials': {
                'email': user_account['email'],
                'temp_password': user_account['temp_password']
            }
        }), 201
    else:
        # If user creation fails, still return student but without credentials
        return jsonify({
            'success': True,
            'message': 'Student created successfully (user account creation failed)',
            'student': new_student
        }), 201

# Update student
@student_bp.route('/<string:student_id>', methods=['PUT'])
def update_student_route(student_id):
    student = get_student_by_id(student_id)
    
    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 404
    
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    # Check if new email already exists for another student
    if 'email' in data:
        existing = get_student_by_email(data['email'])
        if existing and existing['_id'] != student_id:
            return jsonify({'success': False, 'message': 'Email already exists'}), 400
    
    # Check if roll number already exists for another student
    if 'rollNumber' in data:
        existing_roll = get_student_by_roll_number(data['rollNumber'])
        if existing_roll and existing_roll['_id'] != student_id:
            return jsonify({'success': False, 'message': 'Roll number already exists'}), 400
    
    # Update student in MongoDB
    updated_student = update_student(student_id, data)
    
    if updated_student:
        return jsonify({
            'success': True,
            'message': 'Student updated successfully',
            'student': updated_student
        }), 200
    
    return jsonify({
        'success': False,
        'message': 'Failed to update student'
    }), 500

# Delete student
@student_bp.route('/<string:student_id>', methods=['DELETE'])
def delete_student_route(student_id):
    student = get_student_by_id(student_id)
    
    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 404
    
    # Delete student from MongoDB
    success = delete_student(student_id)
    
    if success:
        return jsonify({
            'success': True,
            'message': 'Student deleted successfully'
        }), 200
    
    return jsonify({
        'success': False,
        'message': 'Failed to delete student'
    }), 500

# Get current student profile (based on logged-in user's email)
@student_bp.route('/me', methods=['GET'])
def get_current_student():
    """Get the current logged-in student's profile based on JWT email"""
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return jsonify({'success': False, 'message': 'No token provided'}), 401
    
    try:
        # Extract token from "Bearer <token>"
        token = auth_header.split(' ')[1]
        decoded = jwt.decode(token, get_secret_key(), algorithms=['HS256'])
        email = decoded.get('email')
        
        if not email:
            return jsonify({'success': False, 'message': 'Invalid token - no email found'}), 401
        
        # Get student by email
        student = get_student_by_email(email)
        
        if not student:
            return jsonify({'success': False, 'message': 'Student profile not found'}), 404
        
        return jsonify({
            'success': True,
            'student': student
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'success': False, 'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'success': False, 'message': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Get marks for a specific student (admin view)
@student_bp.route('/<string:student_id>/marks', methods=['GET'])
def get_student_marks_route(student_id):
    """Get marks for a specific student"""
    student = get_student_by_id(student_id)
    
    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 404
    
    marks = get_student_marks(student_id)
    
    return jsonify({
        'success': True,
        'marks': marks,
        'student_id': student_id,
        'student_name': student.get('name')
    }), 200

# Save/update marks for a specific student (admin only)
@student_bp.route('/<string:student_id>/marks', methods=['POST'])
def save_student_marks_route(student_id):
    """Save or update marks for a specific student"""
    student = get_student_by_id(student_id)
    
    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 404
    
    data = request.get_json()
    
    if not data or 'marks' not in data:
        return jsonify({'success': False, 'message': 'Marks data is required'}), 400
    
    marks_data = data.get('marks', [])
    
    # Update marks in MongoDB
    updated_student = update_student_marks(student_id, marks_data)
    
    if updated_student:
        return jsonify({
            'success': True,
            'message': 'Marks saved successfully',
            'marks': marks_data
        }), 200
    
    return jsonify({
        'success': False,
        'message': 'Failed to save marks'
    }), 500

# Get current student's marks (for student view)
@student_bp.route('/me/marks', methods=['GET'])
def get_current_student_marks():
    """Get marks for the currently logged-in student"""
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return jsonify({'success': False, 'message': 'No token provided'}), 401
    
    try:
        # Extract token from "Bearer <token>"
        token = auth_header.split(' ')[1]
        decoded = jwt.decode(token, get_secret_key(), algorithms=['HS256'])
        email = decoded.get('email')
        
        if not email:
            return jsonify({'success': False, 'message': 'Invalid token - no email found'}), 401
        
        # Get student by email
        student = get_student_by_email(email)
        
        if not student:
            return jsonify({'success': False, 'message': 'Student profile not found'}), 404
        
        # Get marks for this student
        marks = get_student_marks(student['_id'])
        
        return jsonify({
            'success': True,
            'student': {
                'id': student['_id'],
                'name': student.get('name'),
                'rollNumber': student.get('rollNumber'),
                'department': student.get('department')
            },
            'marks': marks
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'success': False, 'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'success': False, 'message': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

