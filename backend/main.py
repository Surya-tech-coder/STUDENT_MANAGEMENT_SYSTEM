from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import Depends, Header
import auth
from auth import create_token, get_current_admin, get_current_student

@app.post("/")
def root():
    return {"message": "Welcome to the Student Management System"}
# Admin login
@app.post("/admin/login", response_model=schemas.TokenResponse)
def login_admin(login: schemas.LoginRequest, db: Session = Depends(get_db)):
    admin = crud.authenticate_admin(db, login.username, login.password)
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid admin login")
    token = create_token({"sub": admin.username, "role": "admin"})
    return {"access_token": token, "token_type": "bearer"}

# Student login
@app.post("/student/login", response_model=schemas.TokenResponse, tags=["Students"])
def login_student(login: schemas.LoginRequest, db: Session = Depends(get_db)):
    student = crud.authenticate_student(db, login.username, login.password)
    if not student:
        raise HTTPException(status_code=401, detail="Invalid student login")
    token = create_token({"sub": student.email, "role": "student"})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me/grades", response_model=list[schemas.GradeResponse], tags=["Students"])
def my_grades(current_student=Depends(get_current_student), db: Session = Depends(get_db)):
    return crud.get_grades_for_student(db, current_student.id)

@app.get("/me/attendance", response_model=list[schemas.AttendanceResponse], tags=["Students"])
def my_attendance(current_student=Depends(get_current_student), db: Session = Depends(get_db)):
    return crud.get_attendance_for_student(db, current_student.id)

@app.post("/students/", response_model=schemas.Student,tags=["admin"])
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    print(current_admin)  # Debugging line to check current admin
    student.password = auth.hash_password(student.password)  # Hash password
    return crud.create_student(db, student)


@app.get("/students/", response_model=list[schemas.Student], tags=["admin"])
def read_students(db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return crud.get_students(db)

@app.get("/students/{student_id}", response_model=schemas.Student, tags=["admin"])
def read_student(student_id: int, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    student = crud.get_student(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.put("/students/{student_id}", response_model=schemas.Student, tags=["admin"])
def update_student(student_id: int, student: schemas.StudentCreate, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    updated = crud.update_student(db, student_id, student)
    if not updated:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated

@app.delete("/students/{student_id}", tags=["admin"])
def delete_student(student_id: int, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    deleted = crud.delete_student(db, student_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"detail": "Deleted successfully"}

# ------- Courses -------
@app.post("/courses/", response_model=schemas.Course, tags=["admin"])
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return crud.create_course(db, course)

@app.get("/courses/", response_model=list[schemas.Course], tags=["admin"])
def list_courses(db: Session = Depends(get_db)):
    return crud.get_courses(db)

# ------- Enrollments -------
@app.post("/enroll/",tags=["admin"])
def enroll_student(enroll: schemas.EnrollRequest, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    result = crud.enroll_student(db, enroll.student_id, enroll.course_id)
    if not result:
        raise HTTPException(status_code=404, detail="Student or Course not found")
    return {"detail": "Student enrolled successfully"}

@app.get("/students/{student_id}/courses", response_model=list[schemas.Course], tags=["Students", "admin"])
def get_courses_of_student(student_id: int, db: Session = Depends(get_db)):
    return crud.get_student_courses(db, student_id)

# ---------- Grades ----------
@app.post("/grades/", response_model=schemas.GradeResponse, tags=["admin"])
def assign_grade(grade: schemas.GradeCreate, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return crud.assign_grade(db, grade)

@app.get("/students/{student_id}/grades", response_model=list[schemas.GradeResponse], tags=["Students"])
def get_student_grades(student_id: int, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return crud.get_grades_for_student(db, student_id)

# ---------- Attendance ----------
'''
@app.post("/attendance/", response_model=schemas.AttendanceResponse, tags=["admin"])
def mark_attendance(att: schemas.AttendanceCreate, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return crud.mark_attendance(db, att)
'''
@app.post("/attendance/", response_model=schemas.AttendanceResponse, tags=["admin"])
def mark_attendance_route(
    att: schemas.AttendanceCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return crud.mark_attendance(db, att)


@app.get("/students/{student_id}/attendance", response_model=list[schemas.AttendanceResponse], tags=["Students"])
def get_attendance(student_id: int, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return crud.get_attendance_for_student(db, student_id)

# ------- Admins -------
@app.post("/admin/create", response_model=schemas.Admin)
def create_admin(admin: schemas.AdminCreate, db: Session = Depends(get_db)):
    hashed_password = auth.hash_password(admin.password)
    return crud.create_admin(db, admin.username, hashed_password)
