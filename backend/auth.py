from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import os
from custom_bcrypt import hash_password as bcrypt_hash_password, verify_password as bcrypt_verify_password

# Use environment variable or default (change in production!)
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here_change_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# --- Password ---
def hash_password(password: str) -> str:
    return bcrypt_hash_password(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt_verify_password(plain_password, hashed_password)

# --- Token ---
def create_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=60))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        print("Token decoding failed")
        return None

# --- Auth Dependencies ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import Request, Depends
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme_admin = OAuth2PasswordBearer(tokenUrl="/admin/login")

def get_current_admin(token: str = Depends(oauth2_scheme_admin), db: Session = Depends(get_db)):
    payload = decode_token(token)
    print(token, payload)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Invalid admin token")
    admin = db.query(models.Admin).filter(models.Admin.username == payload["sub"]).first()
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/student/login")  # or your login path

def get_current_student(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload or payload.get("role") != "student":
        raise HTTPException(status_code=401, detail="Invalid student token")
    student = db.query(models.Student).filter(models.Student.email == payload["sub"]).first()
    if not student:
        raise HTTPException(status_code=401, detail="Student not found")
    return student