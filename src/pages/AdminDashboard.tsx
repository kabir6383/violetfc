import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useImages } from '../context/ImageContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { User, ImageRecord } from '../types';
import { Download, Users, Phone, Mail, Shield, CheckCircle2, XCircle, Image as ImageIcon, Save, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { images, refreshImages } = useImages();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'members' | 'images'>('members');
  const [editingImages, setEditingImages] = useState<Record<string, string>>({});
  const [savingImageId, setSavingImageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  const fetchUsersList = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch member database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsersList();
  }, [user, navigate]);

  useEffect(() => {
    if (images.length > 0) {
      const initialEdits: Record<string, string> = {};
      images.forEach((img) => {
        initialEdits[img.id] = img.url;
      });
      setEditingImages(initialEdits);
    }
  }, [images]);

  const handleExport = async () => {
    try {
      const XLSX = await import('xlsx');
      const formatted = users.map((u) => ({
        ID: u.id,
        Name: u.name,
        Age: u.age,
        Phone: u.phone,
        Email: u.email,
        Role: u.role,
        Payment_Status: u.is_paid ? 'Paid' : 'Unpaid',
      }));

      const worksheet = XLSX.utils.json_to_sheet(formatted);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Members Directory');

      const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `violet_members_directory_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('Excel report generated successfully', 'success');
    } catch (err) {
      showToast('Failed to export member records', 'error');
    }
  };

  const togglePaymentStatus = async (userId: number, currentStatus: number) => {
    const nextStatus = currentStatus ? false : true;
    const success = await api.togglePayment(userId, nextStatus);
    if (success) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_paid: nextStatus ? 1 : 0 } : u)));
      showToast(`Member #${userId} status updated to ${nextStatus ? 'Paid' : 'Unpaid'}`, 'success');
    } else {
      showToast('Failed to update member status', 'error');
    }
  };

  const saveImage = async (id: string) => {
    setSavingImageId(id);
    const newUrl = editingImages[id];
    const success = await api.updateImage(id, newUrl);
    if (success) {
      await refreshImages();
      showToast('Image URL updated successfully', 'success');
    } else {
      showToast('Failed to update image', 'error');
    }
    setSavingImageId(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);

    const matchesPayment =
      paymentFilter === 'all' ||
      (paymentFilter === 'paid' && u.is_paid === 1) ||
      (paymentFilter === 'unpaid' && u.is_paid === 0);

    return matchesSearch && matchesPayment;
  });

  const totalPaid = users.filter((u) => u.is_paid === 1).length;
  const totalUnpaid = users.filter((u) => u.is_paid === 0).length;

  const groupedImages = images.reduce((acc, img) => {
    if (!acc[img.section]) acc[img.section] = [];
    acc[img.section].push(img);
    return acc;
  }, {} as Record<string, ImageRecord[]>);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">Loading Dashboard...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-rose-600 font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50/80 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Administrative Console
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Directory & Assets</h1>
            <p className="text-sm text-slate-500 mt-1">Manage member subscriptions, payment verifications, and studio image content.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchUsersList}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              title="Refresh Directory"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-3 rounded-2xl font-bold text-xs transition-all shadow-sm"
            >
              <Download className="w-4 h-4" /> Export Members (.XLSX)
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Total Registered</span>
              <span className="text-3xl font-bold text-slate-900 mt-1 block">{users.length}</span>
            </div>
            <div className="p-3 bg-purple-100 text-purple-900 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">Active Verified</span>
              <span className="text-3xl font-bold text-slate-900 mt-1 block">{totalPaid}</span>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">Payment Pending</span>
              <span className="text-3xl font-bold text-slate-900 mt-1 block">{totalUnpaid}</span>
            </div>
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-4 transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'members' ? 'border-purple-900 text-purple-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Member Roster ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`pb-4 transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'images' ? 'border-purple-900 text-purple-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Facility Images ({images.length})
          </button>
        </div>

        {/* Member Management Tab */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
            {/* Search & Filter controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search member by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-900 focus:ring-1 focus:ring-purple-900 bg-slate-50"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentFilter('all')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    paymentFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setPaymentFilter('paid')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    paymentFilter === 'paid' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() => setPaymentFilter('unpaid')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    paymentFilter === 'unpaid' ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Unpaid
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/70">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                    <th className="p-4">Member ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Age</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Account Role</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No members found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-mono text-slate-400">#{u.id}</td>
                        <td className="p-4 font-bold text-slate-900">{u.name}</td>
                        <td className="p-4">{u.age} yrs</td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="flex items-center gap-1.5 text-slate-600"><Phone className="w-3 h-3 text-slate-400" /> {u.phone}</span>
                            <span className="flex items-center gap-1.5 text-slate-500"><Mail className="w-3 h-3 text-slate-400" /> {u.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-950' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {u.is_paid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Paid Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-full">
                              <XCircle className="w-3.5 h-3.5" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => togglePaymentStatus(u.id, u.is_paid)}
                              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                                u.is_paid
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm'
                              }`}
                            >
                              Mark {u.is_paid ? 'Unpaid' : 'Paid'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content & Images Management Tab */}
        {activeTab === 'images' && (
          <div className="space-y-8">
            {Object.entries(groupedImages).map(([section, sectionImages]) => {
              const imgs = sectionImages as ImageRecord[];
              return (
                <div key={section} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                    {section} Gallery Assets ({imgs.length})
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {imgs.map((img) => (
                    <div key={img.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-900">{img.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{img.id}</span>
                      </div>
                      <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-200">
                        <img src={editingImages[img.id] || img.url} alt={img.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingImages[img.id] || ''}
                          onChange={(e) => setEditingImages({ ...editingImages, [img.id]: e.target.value })}
                          className="flex-grow px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-900 bg-white"
                          placeholder="Image URL"
                        />
                        <button
                          onClick={() => saveImage(img.id)}
                          disabled={savingImageId === img.id}
                          className="flex items-center gap-1 bg-purple-900 hover:bg-purple-950 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          <Save className="w-3.5 h-3.5" />
                          {savingImageId === img.id ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}
