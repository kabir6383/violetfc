import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Dumbbell, ArrowRight, Shield, Lock, Mail, Phone, User as UserIcon, Calendar, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    age: '24',
    phone: '',
    email: '',
    password: '',
    gender: 'female',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.password) {
      setError('Please complete all required fields.');
      return;
    }

    if (Number(formData.age) < 16) {
      setError('Minimum membership age is 16 years.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        age: Number(formData.age),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      showToast('Registration successful! Welcome to VIOLET.', 'success');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Check your details.');
      showToast(err.message || 'Registration error', 'error');
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
          Join VIOLET Center
        </h2>
        <p className="mt-2 text-center text-xs text-slate-500">
          Create your member account to access custom routines and facility bookings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-3xl border border-slate-200/80 sm:px-10">
          <div className="mb-6 p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-2.5 text-xs text-purple-900 font-medium">
            <Shield className="w-4 h-4 shrink-0 text-purple-800" />
            <span>VIOLET is an exclusive training center for women.</span>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 text-slate-900 text-xs font-medium outline-none"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="16"
                    max="90"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-300 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 text-slate-900 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Facility Requirement
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-slate-900 text-xs font-medium bg-slate-50 outline-none cursor-not-allowed"
                  disabled
                >
                  <option value="female">Women Facility</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 text-slate-900 text-xs font-medium outline-none"
                  placeholder="+1 (555) 019-2834"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 text-slate-900 text-xs font-medium outline-none"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
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
                {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-purple-900 hover:underline">
              Sign in to account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
