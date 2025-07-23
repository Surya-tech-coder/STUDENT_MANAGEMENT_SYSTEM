import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import MyGrades from './pages/MyGrades';
import MyAttendance from './pages/MyAttendance';
import AdminAttendance from './pages/AdminAttendance';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={
              <ProtectedRoute requiredRole="admin">
                <Students />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute requiredRole="admin">
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="/my-grades" element={
              <ProtectedRoute requiredRole="student">
                <MyGrades />
              </ProtectedRoute>
            } />
            <Route path="/my-attendance" element={
              <ProtectedRoute requiredRole="student">
                <MyAttendance />
              </ProtectedRoute>
            } />
            <Route path="/admin-attendance" element={
              <ProtectedRoute requiredRole="admin">
                <AdminAttendance />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;