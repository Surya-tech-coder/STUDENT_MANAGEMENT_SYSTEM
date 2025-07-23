from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

# ---------------- Student ----------------
class StudentBase(BaseModel):
    name: str
    age: int
    email: str

class StudentCreate(StudentBase):
    password: str

class Student(StudentBase):
    id: int
    model_config = {
    "from_attributes": True
    }


# ---------------- Course ----------------
class CourseBase(BaseModel):
    name: str
    description: str

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    model_config = {
    "from_attributes": True
    }


# ---------------- Enroll ----------------
class EnrollRequest(BaseModel):
    student_id: int
    course_id: int


# ---------- Grade ----------
class GradeCreate(BaseModel):
    student_id: int
    course_id: int
    grade: str

class GradeResponse(GradeCreate):
    id: int
    model_config = {
    "from_attributes": True
    }

# ---------- Attendance ----------
from enum import Enum

class AttendanceStatus(str, Enum):
    present = "present"
    absent = "absent"

class AttendanceCreate(BaseModel):
    student_id: int
    course_id: int
    date: date
    status: AttendanceStatus  # Use string values like "present", "absent"

class AttendanceResponse(AttendanceCreate):
    id: int
    model_config = {
    "from_attributes": True
    }

# --- Login ---
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# ---------------- Admin ----------------
class AdminBase(BaseModel):
    username: str

class AdminCreate(AdminBase):
    password: str

class Admin(AdminBase):
    id: int

    model_config = {
    "from_attributes": True
    }
