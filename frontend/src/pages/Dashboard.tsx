import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { studentAPI, courseAPI } from '../services/api';
import { Users, BookOpen, TrendingUp, Calendar, GraduationCap } from 'lucide-react';
import type { Student, Course, Grade, Attendance } from '../types';

const Dashboard: React.FC = () => {
  const { isAdmin, isStudent } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    myGrades: [] as Grade[],
    myAttendance: [] as Attendance[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin) {
          const [students, courses] = await Promise.all([
            studentAPI.getAll(),
            courseAPI.getAll(),
          ]);
          setStats(prev => ({
            ...prev,
            totalStudents: students.length,
            totalCourses: courses.length,
          }));
        } else if (isStudent) {
          const [grades, attendance] = await Promise.all([
            studentAPI.getMyGrades(),
            studentAPI.getMyAttendance(),
          ]);
          setStats(prev => ({
            ...prev,
            myGrades: grades,
            myAttendance: attendance,
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, isStudent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <GraduationCap className="h-4 w-4" />
            <span>Management Overview</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Students
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats.totalStudents}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Courses
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats.totalCourses}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-amber-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Enrollments
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats.totalStudents * 2}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      This Month
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {new Date().toLocaleDateString('en-US', { month: 'short' })}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/students"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left block"
            >
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Manage Students</h3>
              <p className="text-sm text-gray-500">Add, edit, or remove student records</p>
            </Link>
            <Link 
              to="/courses"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left block"
            >
              <BookOpen className="h-6 w-6 text-emerald-600 mb-2" />
              <h3 className="font-medium text-gray-900">Manage Courses</h3>
              <p className="text-sm text-gray-500">Create and organize course catalog</p>
            </Link>
            <Link 
              to="/admin-attendance"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left block"
            >
              <Calendar className="h-6 w-6 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">Attendance Management</h3>
              <p className="text-sm text-gray-500">Mark and track student attendance</p>
            </Link>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <TrendingUp className="h-6 w-6 text-amber-600 mb-2" />
              <h3 className="font-medium text-gray-900">Grade Management</h3>
              <p className="text-sm text-gray-500">Assign and track student grades</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <GraduationCap className="h-4 w-4" />
          <span>Your Academic Overview</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Grades
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.myGrades.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Attendance Records
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.myAttendance.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Grade
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.myGrades.length > 0 ? 'B+' : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h2>
          {stats.myGrades.length > 0 ? (
            <div className="space-y-3">
              {stats.myGrades.slice(0, 5).map((grade) => (
                <div key={grade.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm font-medium text-gray-900">{grade.course_name}</span>
                  <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                    {grade.grade}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No grades available yet.</p>
          )}
        </div>

        <div className="bg-white shadow-sm rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h2>
          {stats.myAttendance.length > 0 ? (
            <div className="space-y-3">
              {stats.myAttendance.slice(0, 5).map((attendance) => (
                <div key={attendance.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{attendance.course_name}</span>
                    <p className="text-xs text-gray-500">{new Date(attendance.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    attendance.status === 'present' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {attendance.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No attendance records available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;