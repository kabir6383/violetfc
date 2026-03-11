import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    password: '',
    gender: 'female' // Default and only option
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.gender !== 'female') {
      setError('VIOLET is a female-only fitness center.');
      return;
    }

    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem('violet_users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === formData.email || u.phone === formData.phone);
      if (existingUser) {
        throw new Error('Phone number or email already registered');
      }

      const newUser = {
        id: Date.now(),
        name: formData.name,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: 'user',
        is_paid: 0
      };

      users.push(newUser);
      localStorage.setItem('violet_users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      
      login(newUser.id.toString(), userWithoutPassword);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-violet-600 mb-6">
          <Dumbbell className="w-12 h-12" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-stone-900">
          Join VIOLET
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Already a member?{' '}
          <Link to="/login" className="font-medium text-violet-600 hover:text-violet-500">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-stone-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700">Full Name</label>
              <div className="mt-1">
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-stone-700">Age</label>
                <div className="mt-1">
                  <input id="age" name="age" type="number" min="16" required value={formData.age} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-stone-700">Gender</label>
                <div className="mt-1">
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm bg-stone-50">
                    <option value="female">Female Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-stone-700">Phone Number</label>
              <div className="mt-1">
                <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700">Email Address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700">Password</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
