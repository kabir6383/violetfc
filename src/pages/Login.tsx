import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Dumbbell, ArrowRight, Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your phone number/email and password.');
      return;
    }

    setLoading(true);

    try {
      await login(identifier.trim(), password);
      showToast('Signed in successfully', 'success');
      // Read current state after login to decide target
      const stored = localStorage.getItem('violet_users');
      let isAdminUser = false;
      if (stored) {
        const parsed = JSON.parse(stored);
        const match = parsed.find((u: any) => u.phone === identifier || u.email === identifier);
        if (match?.role === 'admin') isAdminUser = true;
      }
      navigate(isAdminUser || identifier.toLowerCase().includes('admin') ? '/admin' : '/');
    } catch (err: any) {
      setError(err.message || 'Invalid phone, email, or password.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-purple-900 rounded-2xl flex items-center justify-center text-purple-200 shadow-md">
            <Dumbbell className="w-7 h-7" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-serif font-extrabold text-slate-900 tracking-tight">
          Member Portal Login
        </h2>
        <p className="mt-2 text-center text-xs text-slate-500">
          Sign in to access your customized fitness schedule & nutrition plan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-3xl border border-slate-200/80 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="identifier" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number or Email
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 text-slate-900 text-xs font-medium outline-none"
                  placeholder="e.g. 9990001111 or member@violet.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 text-slate-900 text-xs font-medium outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-2xl shadow-sm text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 focus:outline-none disabled:opacity-50 transition-all"
              >
                {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
            Don't have a membership account?{' '}
            <Link to="/register" className="font-bold text-purple-900 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
