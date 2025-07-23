export interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  phone?: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
}

export interface Grade {
  id: number;
  student_id: number;
  course_id: number;
  grade: string;
  student_name: string;
  course_name: string;
}

export interface Attendance {
  id: number;
  student_id: number;
  course_id: number;
  date: string;
  status: string;
  student_name: string;
  course_name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface StudentCreate {
  name: string;
  email: string;
  age: number;
  phone?: string;
  password: string;
}

export interface CourseCreate {
  name: string;
  description: string;
}

export interface GradeCreate {
  student_id: number;
  course_id: number;
  grade: string;
}

export interface AttendanceCreate {
  student_id: number;
  course_id: number;
  date: string;
  status: string;
}

export interface EnrollRequest {
  student_id: number;
  course_id: number;
}

export interface AdminCreate {
  username: string;
  password: string;
}

export interface User {
  username: string;
  role: 'admin' | 'student';
  id?: number;
}