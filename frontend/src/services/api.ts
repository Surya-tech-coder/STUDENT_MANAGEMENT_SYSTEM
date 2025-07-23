import axios, { AxiosRequestConfig } from 'axios';
import type { 
  LoginRequest, 
  TokenResponse, 
  Student, 
  StudentCreate, 
  Course, 
  CourseCreate, 
  Grade, 
  GradeCreate,
  Attendance,
  AttendanceCreate,
  EnrollRequest,
  AdminCreate
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  loginAdmin: async (credentials: LoginRequest): Promise<TokenResponse> => {
    try {
      const config: AxiosRequestConfig = {
        method: 'post',
        url: `${API_BASE_URL}/admin/login`,
        data: credentials,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  loginStudent: async (credentials: LoginRequest): Promise<TokenResponse> => {
    try {
      const response = await api.post('/student/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Student login error:', error);
      throw error;
    }
  },

  createAdmin: (admin: AdminCreate) =>
    api.post('/admin/create', admin).then(res => res.data),
};

// Student endpoints
export const studentAPI = {
  getAll: (): Promise<Student[]> =>
    api.get('/students/').then(res => res.data),
  
  getById: (id: number): Promise<Student> =>
    api.get(`/students/${id}`).then(res => res.data),
  
  create: (student: StudentCreate): Promise<Student> =>
    api.post('/students/', student).then(res => res.data),
  
  update: (id: number, student: StudentCreate): Promise<Student> =>
    api.put(`/students/${id}`, student).then(res => res.data),
  
  delete: (id: number) =>
    api.delete(`/students/${id}`).then(res => res.data),
  
  getCourses: (id: number): Promise<Course[]> =>
    api.get(`/students/${id}/courses`).then(res => res.data),
  
  getGrades: (id: number): Promise<Grade[]> =>
    api.get(`/students/${id}/grades`).then(res => res.data),
  
  getAttendance: (id: number): Promise<Attendance[]> =>
    api.get(`/students/${id}/attendance`).then(res => res.data),
  
  getMyGrades: (): Promise<Grade[]> =>
    api.get('/me/grades').then(res => res.data),
  
  getMyAttendance: (): Promise<Attendance[]> =>
    api.get('/me/attendance').then(res => res.data),
};

// Course endpoints
export const courseAPI = {
  getAll: (): Promise<Course[]> =>
    api.get('/courses/').then(res => res.data),
  
  create: (course: CourseCreate): Promise<Course> =>
    api.post('/courses/', course).then(res => res.data),
};

// Grade endpoints
export const gradeAPI = {
  assign: (grade: GradeCreate): Promise<Grade> =>
    api.post('/grades/', grade).then(res => res.data),
};

// Attendance endpoints
export const attendanceAPI = {
  getAll: (): Promise<Attendance[]> =>
    api.get('/attendance/').then(res => res.data),
  mark: (attendance: AttendanceCreate): Promise<Attendance> =>
    api.post('/attendance/', attendance).then(res => res.data),
};

// Enrollment endpoints
export const enrollmentAPI = {
  enroll: (enrollment: EnrollRequest) =>
    api.post('/enroll/', enrollment).then(res => res.data),
};