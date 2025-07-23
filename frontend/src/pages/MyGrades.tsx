import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { TrendingUp, BookOpen, Award } from 'lucide-react';
import type { Grade } from '../types';

const MyGrades: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await studentAPI.getMyGrades();
        setGrades(data);
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A':
      case 'A+':
        return 'bg-emerald-100 text-emerald-800';
      case 'B':
      case 'B+':
        return 'bg-blue-100 text-blue-800';
      case 'C':
      case 'C+':
        return 'bg-amber-100 text-amber-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      case 'F':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    
    const total = grades.reduce((sum, grade) => sum + (gradePoints[grade.grade] || 0), 0);
    return (total / grades.length).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Award className="h-4 w-4" />
          <span>Academic Performance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Current GPA
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {calculateGPA()}
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
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Courses
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {grades.length}
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
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Best Grade
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {grades.length > 0 ? Math.max(...grades.map(g => g.grade.charCodeAt(0) === 65 ? 4 : 0)) > 0 ? 'A' : 'B+' : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Grade Report</h2>
        </div>
        
        {grades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{grade.course_name}</div>
                          <div className="text-sm text-gray-500">Course ID: {grade.course_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              ['A+', 'A'].includes(grade.grade) ? 'bg-emerald-600' :
                              ['B+', 'B'].includes(grade.grade) ? 'bg-blue-600' :
                              ['C+', 'C'].includes(grade.grade) ? 'bg-amber-600' :
                              'bg-red-600'
                            }`}
                            style={{ 
                              width: `${
                                ['A+', 'A'].includes(grade.grade) ? 100 :
                                ['B+', 'B'].includes(grade.grade) ? 80 :
                                ['C+', 'C'].includes(grade.grade) ? 60 : 40
                              }%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {['A+', 'A'].includes(grade.grade) ? 'Excellent' :
                           ['B+', 'B'].includes(grade.grade) ? 'Good' :
                           ['C+', 'C'].includes(grade.grade) ? 'Average' : 'Below Average'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No grades available</h3>
            <p className="mt-1 text-sm text-gray-500">Your grades will appear here once they are assigned.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGrades;