import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useImages } from '../context/ImageContext';
import { Download, Users, Phone, Mail, Shield, CheckCircle, XCircle, Image as ImageIcon, Save } from 'lucide-react';
import { useNavigate } from 'react-router';

interface UserData {
  id: number;
  name: string;
  age: number;
  phone: string;
  email: string;
  role: string;
  is_paid: number;
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const { images, refreshImages } = useImages();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'members' | 'images'>('members');
  const [editingImages, setEditingImages] = useState<Record<string, string>>({});
  const [savingImageId, setSavingImageId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (images.length > 0) {
      const initialEdits: Record<string, string> = {};
      images.forEach(img => {
        initialEdits[img.id] = img.url;
      });
      setEditingImages(initialEdits);
    }
  }, [images]);

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/export', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'violet_users.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to export data');
    }
  };

  const togglePaymentStatus = async (userId: number, currentStatus: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/payment`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ is_paid: currentStatus ? 0 : 1 })
      });
      
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, is_paid: currentStatus ? 0 : 1 } : u));
      }
    } catch (err) {
      alert('Failed to update payment status');
    }
  };

  const saveImage = async (id: string) => {
    setSavingImageId(id);
    try {
      const res = await fetch(`/api/admin/images/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ url: editingImages[id] })
      });
      
      if (res.ok) {
        await refreshImages();
      } else {
        alert('Failed to update image');
      }
    } catch (err) {
      alert('Failed to update image');
    } finally {
      setSavingImageId(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  const groupedImages = images.reduce((acc, img) => {
    if (!acc[img.section]) acc[img.section] = [];
    acc[img.section].push(img);
    return acc;
  }, {} as Record<string, typeof images>);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-2">
              <Shield className="w-8 h-8 text-violet-600" />
              Admin Dashboard
            </h1>
            <p className="text-stone-600 mt-1">Manage VIOLET fitness center members and content</p>
          </div>
          
          {activeTab === 'members' && (
            <button 
              onClick={handleExport}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Download className="w-5 h-5" />
              Export to Excel
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-4 px-4 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'members' ? 'border-b-2 border-violet-600 text-violet-600' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Users className="w-4 h-4" />
            Members & Payments
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`pb-4 px-4 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'images' ? 'border-b-2 border-violet-600 text-violet-600' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <ImageIcon className="w-4 h-4" />
            Content Management
          </button>
        </div>

        {activeTab === 'members' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-6 border-b border-stone-200 bg-stone-50/50 flex items-center gap-3">
              <Users className="w-5 h-5 text-stone-500" />
              <h2 className="text-lg font-semibold text-stone-800">Registered Members ({users.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 text-sm uppercase tracking-wider border-b border-stone-200">
                    <th className="p-4 font-medium">ID</th>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Age</th>
                    <th className="p-4 font-medium">Contact</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Payment Status</th>
                    <th className="p-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 text-stone-500 font-mono text-sm">#{u.id}</td>
                      <td className="p-4 font-medium text-stone-900">{u.name}</td>
                      <td className="p-4 text-stone-600">{u.age}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="flex items-center gap-1 text-stone-600"><Phone className="w-3 h-3" /> {u.phone}</span>
                          <span className="flex items-center gap-1 text-stone-500"><Mail className="w-3 h-3" /> {u.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-violet-100 text-violet-800' : 'bg-stone-100 text-stone-800'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.is_paid ? (
                          <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                            <CheckCircle className="w-4 h-4" /> Paid
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-stone-400 text-sm font-medium">
                            <XCircle className="w-4 h-4" /> Unpaid
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => togglePaymentStatus(u.id, u.is_paid)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${u.is_paid ? 'bg-stone-100 text-stone-600 hover:bg-stone-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                          >
                            Mark as {u.is_paid ? 'Unpaid' : 'Paid'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-8">
            {Object.entries(groupedImages).map(([section, sectionImages]) => (
              <div key={section} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-6 border-b border-stone-200 bg-stone-50/50">
                  <h2 className="text-lg font-semibold text-stone-800 capitalize">{section} Images</h2>
                </div>
                <div className="p-6 grid gap-6 md:grid-cols-2">
                  {(sectionImages as typeof images).map(img => (
                    <div key={img.id} className="border border-stone-100 rounded-lg p-4 bg-stone-50">
                      <h3 className="font-medium text-stone-900 mb-2">{img.title}</h3>
                      <div className="aspect-video w-full mb-4 rounded-md overflow-hidden bg-stone-200">
                        <img src={editingImages[img.id] || img.url} alt={img.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={editingImages[img.id] || ''}
                          onChange={(e) => setEditingImages({ ...editingImages, [img.id]: e.target.value })}
                          className="flex-1 px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                          placeholder="Image URL"
                        />
                        <button 
                          onClick={() => saveImage(img.id)}
                          disabled={savingImageId === img.id || editingImages[img.id] === img.url}
                          className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 disabled:bg-stone-300 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          {savingImageId === img.id ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
