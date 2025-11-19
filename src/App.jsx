import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Projects from './pages/Projects';
import CorporatePlans from './pages/CorporatePlans';
import Clients from './pages/Clients';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/services"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Services />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/blog"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Blog />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/projects"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Projects />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/corporate-plans"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CorporatePlans />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
         <Route
            path="/dashboard/clients"
            element={
              <ProtectedRoute>
                <AdminLayout>
                 <Clients />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirigir a dashboard por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;