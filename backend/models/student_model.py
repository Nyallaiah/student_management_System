from bson import ObjectId
from flask import current_app
import secrets
import string

# MongoDB collection names
STUDENTS_COLLECTION = 'students'
USERS_COLLECTION = 'users'

def get_db():
    """Get the MongoDB database instance"""
    return current_app.mongo.db

def get_students_collection():
    """Get the students collection"""
    return get_db()[STUDENTS_COLLECTION]

def get_users_collection():
    """Get the users collection"""
    return get_db()[USERS_COLLECTION]

def generate_temp_password(length=8):
    """Generate a temporary password"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

# Student Model functions using MongoDB
def get_all_students():
    """Get all students from MongoDB"""
    students = []
    for student in get_students_collection().find():
        student['_id'] = str(student['_id'])
        students.append(student)
    return students

def get_student_by_id(student_id):
    """Get a student by ID from MongoDB"""
    try:
        student = get_students_collection().find_one({'_id': ObjectId(student_id)})
        if student:
            student['_id'] = str(student['_id'])
        return student
    except:
        return None

def get_student_by_email(email):
    """Get a student by email from MongoDB"""
    student = get_students_collection().find_one({'email': email})
    if student:
        student['_id'] = str(student['_id'])
    return student

def create_student(data):
    """Create a new student in MongoDB"""
    student = {
        'name': data.get('name'),
        'rollNumber': data.get('rollNumber'),
        'email': data.get('email'),
        'department': data.get('department'),
        'phone': data.get('phone', ''),
        'marks': []  # Initialize empty marks array
    }
    result = get_students_collection().insert_one(student)
    student['_id'] = str(result.inserted_id)
    return student

def update_student(student_id, data):
    """Update a student in MongoDB"""
    try:
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'rollNumber' in data:
            update_data['rollNumber'] = data['rollNumber']
        if 'email' in data:
            update_data['email'] = data['email']
        if 'department' in data:
            update_data['department'] = data['department']
        if 'phone' in data:
            update_data['phone'] = data['phone']
        
        result = get_students_collection().update_one(
            {'_id': ObjectId(student_id)},
            {'$set': update_data}
        )
        
        if result.modified_count > 0:
            return get_student_by_id(student_id)
        return None
    except Exception as e:
        print(f"Error updating student: {e}")
        return None

def delete_student(student_id):
    """Delete a student from MongoDB"""
    try:
        result = get_students_collection().delete_one({'_id': ObjectId(student_id)})
        return result.deleted_count > 0
    except:
        return False

# Marks Model functions using MongoDB
def calculate_grade(marks, total=100):
    """Calculate grade based on marks percentage"""
    try:
        percentage = (float(marks) / float(total)) * 100
    except (TypeError, ZeroDivisionError):
        percentage = 0
    
    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B+"
    elif percentage >= 60:
        return "B"
    elif percentage >= 50:
        return "C"
    elif percentage >= 40:
        return "D"
    else:
        return "F"

def calculate_status(marks, total=100):
    """Calculate status (Pass/Fail) based on marks"""
    try:
        percentage = (float(marks) / float(total)) * 100
    except (TypeError, ZeroDivisionError):
        percentage = 0
    
    return "Pass" if percentage >= 40 else "Fail"

def get_student_marks(student_id):
    """Get marks for a specific student"""
    try:
        student = get_students_collection().find_one({'_id': ObjectId(student_id)})
        if student:
            return student.get('marks', [])
        return []
    except:
        return []

def update_student_marks(student_id, marks_data):
    """Update marks for a specific student"""
    try:
        # Process marks data to ensure grade and status are calculated
        processed_marks = []
        for mark in marks_data:
            processed_mark = {
                'subject': mark.get('subject', ''),
                'marks': mark.get('marks', 0),
                'total': mark.get('total', 100),
                'credits': mark.get('credits', 3),
                'grade': mark.get('grade', calculate_grade(mark.get('marks', 0), mark.get('total', 100))),
                'status': mark.get('status', calculate_status(mark.get('marks', 0), mark.get('total', 100)))
            }
            processed_marks.append(processed_mark)
        
        result = get_students_collection().update_one(
            {'_id': ObjectId(student_id)},
            {'$set': {'marks': processed_marks}}
        )
        
        if result.modified_count > 0:
            return get_student_by_id(student_id)
        return None
    except Exception as e:
        print(f"Error updating marks: {e}")
        return None

# User Model functions using MongoDB
def get_user_by_email(email):
    """Get a user by email from MongoDB"""
    user = get_users_collection().find_one({'email': email})
    if user:
        user['_id'] = str(user['_id'])
    return user

def create_user_from_student(student_data):
    """Create a user account for a student with temporary password"""
    email = student_data.get('email')
    
    # Check if user already exists
    if get_user_by_email(email):
        return None
    
    # Generate temporary password
    temp_password = generate_temp_password()
    
    user = {
        'email': email,
        'password': temp_password,
        'role': 'student',
        'name': student_data.get('name'),
        'rollNumber': student_data.get('rollNumber'),
        'department': student_data.get('department'),
        'phone': student_data.get('phone', ''),
        'student_id': str(student_data.get('_id')),
        'is_verified': False  # Student needs to set their own password
    }
    
    result = get_users_collection().insert_one(user)
    user['_id'] = str(result.inserted_id)
    user['temp_password'] = temp_password  # Return temp password (only once)
    return user

def update_user_password(email, new_password):
    """Update user password (for student signup)"""
    try:
        result = get_users_collection().update_one(
            {'email': email},
            {'$set': {'password': new_password, 'is_verified': True}}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error updating password: {e}")
        return False

def create_default_users():
    """Create default admin and student users if they don't exist"""
    users_collection = get_users_collection()
    
    # Check if admin user exists
    if not users_collection.find_one({'email': 'admin@gmail.com'}):
        admin_user = {
            'email': 'admin@gmail.com',
            'password': 'admin123',
            'role': 'admin',
            'name': 'Admin User'
        }
        users_collection.insert_one(admin_user)
        print("Created default admin user")
    
    # Check if student user exists
    if not users_collection.find_one({'email': 'student@gmail.com'}):
        student_user = {
            'email': 'student@gmail.com',
            'password': 'student123',
            'role': 'student',
            'name': 'Student User'
        }
        users_collection.insert_one(student_user)
        print("Created default student user")

# Initialize database with default data
def init_db():
    """Initialize the database with default users"""
    create_default_users()
    
    # Check if we need to add sample students
    students_collection = get_students_collection()
    if students_collection.count_documents({}) == 0:
        sample_students = [
            {'name': 'Ravi Kumar', 'rollNumber': '22CSE101', 'email': 'ravi@example.com', 'department': 'CSE', 'phone': '9876543210'},
            {'name': 'Priya Sharma', 'rollNumber': '22CSE102', 'email': 'priya@example.com', 'department': 'CSE', 'phone': '9876543211'},
            {'name': 'Amit Patel', 'rollNumber': '22ECE101', 'email': 'amit@example.com', 'department': 'ECE', 'phone': '9876543212'},
            {'name': 'Sneha Gupta', 'rollNumber': '22ME101', 'email': 'sneha@example.com', 'department': 'ME', 'phone': '9876543213'},
            {'name': 'Demo Student', 'rollNumber': '22CSE100', 'email': 'student@gmail.com', 'department': 'CSE', 'phone': '9876543200'},
        ]
        students_collection.insert_many(sample_students)
        print("Created sample students")

