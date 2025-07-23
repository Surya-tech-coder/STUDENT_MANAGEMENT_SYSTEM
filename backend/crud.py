from sqlalchemy.orm import Session
import models, schemas

def get_students(db: Session):
    return db.query(models.Student).all()

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def update_student(db: Session, student_id: int, student: schemas.StudentCreate):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student:
        for key, value in student.model_dump().items():
            setattr(db_student, key, value)
        db.commit()
        db.refresh(db_student)
    return db_student

def delete_student(db: Session, student_id: int):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student:
        db.delete(db_student)
        db.commit()
    return db_student

# Add to existing crud.py
from models import Student, Course
from sqlalchemy.orm import Session
import schemas

# ----- Course -----
def create_course(db: Session, course: schemas.CourseCreate):
    db_course = Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def get_courses(db: Session):
    return db.query(Course).all()

# ----- Enroll -----
def enroll_student(db: Session, student_id: int, course_id: int):
    student = db.query(Student).filter(Student.id == student_id).first()
    course = db.query(Course).filter(Course.id == course_id).first()
    if student and course:
        student.courses.append(course)
        db.commit()
        db.refresh(student)
        return student
    return None

def get_student_courses(db: Session, student_id: int):
    student = db.query(Student).filter(Student.id == student_id).first()
    return student.courses if student else []

from models import Grade, Attendance
from datetime import date

# ---- Grades ----
def assign_grade(db: Session, grade_data: schemas.GradeCreate):
    grade = Grade(**grade_data.model_dump())
    db.add(grade)
    db.commit()
    db.refresh(grade)
    return grade

def get_grades_for_student(db: Session, student_id: int):
    return db.query(Grade).filter(Grade.student_id == student_id).all()

# ---- Attendance ----
def mark_attendance(db: Session, att: schemas.AttendanceCreate):
    attendance_data = att.model_dump()
    attendance_data["present"] = attendance_data.pop("status") == "present"
    
    attendance = Attendance(**attendance_data)
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


def get_attendance_for_student(db: Session, student_id: int):
    return db.query(Attendance).filter(Attendance.student_id == student_id).all()

def create_admin(db: Session, username: str, password: str):
    admin = models.Admin(username=username, password=password)  # password already hashed
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin

def authenticate_admin(db: Session, username: str, password: str):
    from auth import verify_password
    admin = db.query(models.Admin).filter(models.Admin.username == username).first()
    if admin and verify_password(password, admin.password):
        return admin
    return None

def authenticate_student(db: Session, email: str, password: str):
    from auth import verify_password
    student = db.query(models.Student).filter(models.Student.email == email).first()
    if student and verify_password(password, student.password):
        return student
    return None
