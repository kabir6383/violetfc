import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Menu, X, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-violet-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-violet-300" />
              <span className="font-bold text-xl tracking-wider">VIOLET</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-violet-300 transition-colors">Home</Link>
            <Link to="/workouts" className="hover:text-violet-300 transition-colors">Workouts</Link>
            <Link to="/nutrition" className="hover:text-violet-300 transition-colors">Nutrition</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-violet-300 hover:text-white font-medium">
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 bg-violet-800 px-3 py-1 rounded-full">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-violet-300 transition-colors">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-violet-500 hover:bg-violet-400 text-white px-4 py-2 rounded-md transition-colors font-medium"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-violet-300">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-violet-800 pb-4 px-4 space-y-2">
          <Link to="/" className="block py-2 hover:text-violet-300" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/workouts" className="block py-2 hover:text-violet-300" onClick={() => setIsOpen(false)}>Workouts</Link>
          <Link to="/nutrition" className="block py-2 hover:text-violet-300" onClick={() => setIsOpen(false)}>Nutrition</Link>
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="block py-2 text-violet-300 font-medium" onClick={() => setIsOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              <div className="py-2 border-t border-violet-700 mt-2">
                <span className="block text-sm text-violet-300 mb-2">Signed in as {user.name}</span>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-2 text-red-300">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-violet-700 flex flex-col gap-2">
              <Link to="/login" className="block py-2 hover:text-violet-300" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="block py-2 text-center bg-violet-500 rounded-md" onClick={() => setIsOpen(false)}>Join Now</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
