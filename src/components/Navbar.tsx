import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Dumbbell, Menu, X, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'info');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-950 text-slate-100 border-b border-purple-900/30 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-700/60 flex items-center justify-center text-purple-200 group-hover:bg-purple-800 transition-colors shadow-inner">
              <Dumbbell className="h-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-white font-serif">VIOLET</span>
              <span className="text-[10px] text-purple-300 uppercase tracking-widest -mt-1 font-sans">Fitness Center for Women</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 font-medium text-sm">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl transition-all ${
                isActive('/') ? 'bg-purple-900/60 text-white border border-purple-700/50' : 'text-slate-300 hover:text-white hover:bg-slate-900/70'
              }`}
            >
              Home
            </Link>
            <Link
              to="/workouts"
              className={`px-4 py-2 rounded-xl transition-all ${
                isActive('/workouts') ? 'bg-purple-900/60 text-white border border-purple-700/50' : 'text-slate-300 hover:text-white hover:bg-slate-900/70'
              }`}
            >
              Workouts
            </Link>
            <Link
              to="/nutrition"
              className={`px-4 py-2 rounded-xl transition-all ${
                isActive('/nutrition') ? 'bg-purple-900/60 text-white border border-purple-700/50' : 'text-slate-300 hover:text-white hover:bg-slate-900/70'
              }`}
            >
              Nutrition & Meals
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 font-semibold text-amber-300 transition-all ${
                  isActive('/admin') ? 'bg-amber-950/40 border border-amber-800/60' : 'hover:bg-amber-950/20'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Desktop User / Auth Action */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs">
                  <div className="w-6 h-6 rounded-full bg-purple-900 text-purple-200 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-200">{user.name}</span>
                  {user.is_paid ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Member"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-500" title="Pending Payment"></span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors font-medium">
                  Member Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-900 hover:bg-purple-800 border border-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
                >
                  Join Center
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-900 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${isActive('/') ? 'bg-purple-900/60 text-white' : 'text-slate-300'}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/workouts"
            className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${isActive('/workouts') ? 'bg-purple-900/60 text-white' : 'text-slate-300'}`}
            onClick={() => setIsOpen(false)}
          >
            Workouts
          </Link>
          <Link
            to="/nutrition"
            className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${isActive('/nutrition') ? 'bg-purple-900/60 text-white' : 'text-slate-300'}`}
            onClick={() => setIsOpen(false)}
          >
            Nutrition & Meals
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-300 bg-amber-950/40"
              onClick={() => setIsOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-slate-900">
            {user ? (
              <div className="flex justify-between items-center px-4 py-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <UserIcon className="w-4 h-4 text-purple-400" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold px-3 py-1.5 rounded-lg bg-rose-950/30"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-slate-800 text-slate-200 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Member Login
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-xl bg-purple-900 text-white text-sm font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Join Center
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
