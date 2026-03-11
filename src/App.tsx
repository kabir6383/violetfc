import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Mail, Phone, MapPin } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ImageProvider } from './context/ImageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <ImageProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col font-sans text-stone-900 bg-stone-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/workouts" 
                  element={
                    <ProtectedRoute>
                      <Workouts />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/nutrition" 
                  element={
                    <ProtectedRoute>
                      <Nutrition />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <footer className="bg-stone-900 text-stone-400 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">VIOLET Fitness Center</h3>
                    <p className="text-stone-400 max-w-xs">An exclusive fitness center designed for women. Build confidence, achieve your goals, and join a supportive community.</p>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-violet-400" />
                        <span>123 Fitness Ave, Wellness City, NY 10001</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-violet-400" />
                        <span>+1 (555) 123-4567</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-violet-400" />
                        <span>hello@violetfitness.com</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Hours</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between"><span>Monday - Friday</span> <span>6:00 AM - 10:00 PM</span></li>
                      <li className="flex justify-between"><span>Saturday</span> <span>8:00 AM - 8:00 PM</span></li>
                      <li className="flex justify-between"><span>Sunday</span> <span>8:00 AM - 6:00 PM</span></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-stone-800 pt-8 text-center text-sm">
                  <p>&copy; {new Date().getFullYear()} VIOLET Fitness Center. Empowering Women.</p>
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </ImageProvider>
    </AuthProvider>
  );
}

