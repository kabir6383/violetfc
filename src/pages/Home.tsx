import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Activity, Salad, CheckCircle2, AlertCircle, PlayCircle, Settings, X, Shield, Users, Calendar } from 'lucide-react';
import { useImages } from '../context/ImageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import FitnessCalculator from '../components/FitnessCalculator';
import ClassScheduleSection from '../components/ClassScheduleSection';

export default function Home() {
  const { getImageUrl } = useImages();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [preferences, setPreferences] = useState(() => {
    if (user) {
      const saved = localStorage.getItem(`violet_prefs_${user.id}`);
      if (saved) return JSON.parse(saved);
    }
    return {
      membership: true,
      quickStats: true,
      calculator: true,
      schedule: true,
      recommended: true,
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`violet_prefs_${user.id}`, JSON.stringify(preferences));
    }
  }, [preferences, user]);

  const handleSavePreferences = () => {
    setIsCustomizing(false);
    showToast('Dashboard layout saved', 'success');
  };

  if (user) {
    return (
      <div className="min-h-screen bg-slate-50/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
                  Member Portal
                </span>
                {user.role === 'admin' && (
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                    Admin Access
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user.name}</h1>
              <p className="text-sm text-slate-500 mt-1">Here is your daily training dashboard and facility overview.</p>
            </div>
            <button
              onClick={() => setIsCustomizing(true)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl transition-colors text-xs font-bold border border-slate-200"
            >
              <Settings className="w-4 h-4 text-slate-500" /> Adjust Layout
            </button>
          </div>

          {/* Membership & Action Banner */}
          {(preferences.membership || preferences.quickStats) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Membership Status Card */}
              {preferences.membership && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Membership Status</h3>
                    {user.is_paid ? (
                      <div className="flex items-center gap-3 text-emerald-800 bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold text-sm">Active & Verified</p>
                          <p className="text-xs text-emerald-700">Full facility & studio access granted</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-amber-900 bg-amber-50/80 border border-amber-200 p-4 rounded-2xl">
                        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                        <div>
                          <p className="font-bold text-sm">Payment Verification Due</p>
                          <p className="text-xs text-amber-700">Check in at front desk to settle monthly dues</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <span>Member ID: #{user.id}</span>
                    <span className="capitalize text-purple-900 font-semibold">{user.role} Account</span>
                  </div>
                </div>
              )}

              {/* Quick Action Hero Banner */}
              {preferences.quickStats && (
                <div className={`bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 rounded-3xl p-8 text-white shadow-sm flex flex-col justify-between relative overflow-hidden ${preferences.membership ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                  <div className="relative z-10 space-y-4">
                    <span className="text-xs font-semibold text-purple-300 uppercase tracking-widest bg-purple-900/60 px-3 py-1 rounded-full border border-purple-700/50">
                      Training Session
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready for today's session?</h3>
                    <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
                      Select your target workout routine or check the weekly group schedule below to lock in your spot.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Link
                        to="/workouts"
                        className="bg-white text-purple-950 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2 shadow-sm"
                      >
                        <PlayCircle className="w-4 h-4 text-purple-900" /> View Workouts
                      </Link>
                      <Link
                        to="/nutrition"
                        className="bg-purple-900/60 hover:bg-purple-800 text-purple-100 border border-purple-700/60 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                      >
                        <Salad className="w-4 h-4 text-purple-300" /> Meal Protocols
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Calculator Component */}
          {preferences.calculator && <FitnessCalculator />}

          {/* Studio Schedule Component */}
          {preferences.schedule && <ClassScheduleSection />}

          {/* Recommended Programs */}
          {preferences.recommended && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recommended Programs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Workout Card */}
                <Link
                  to="/workouts"
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 hover:border-purple-300 transition-all flex flex-col sm:flex-row"
                >
                  <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
                    <img
                      src={getImageUrl('workout-aerobic', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop')}
                      alt="Aerobic training"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-purple-900 mb-2">
                        <Activity className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-wider">Cardio & Endurance</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Aerobic Routine</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">High-energy cardiovascular training structured for calorie burn and heart health.</p>
                    </div>
                    <span className="mt-4 text-purple-900 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore Routines <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>

                {/* Nutrition Card */}
                <Link
                  to="/nutrition"
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col sm:flex-row"
                >
                  <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
                    <img
                      src={getImageUrl('nutri-health', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop')}
                      alt="Whole food nutrition"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-700 mb-2">
                        <Salad className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-wider">Meal Guidance</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Vitality & Nutrition</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">Balanced macro nutrition focusing on whole foods for sustained daily energy.</p>
                    </div>
                    <span className="mt-4 text-emerald-800 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Meal Plans <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Modal for Layout Preferences */}
          {isCustomizing && (
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-slate-200">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">Configure Dashboard</h3>
                  <button onClick={() => setIsCustomizing(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'membership', title: 'Membership Status', desc: 'Display payment state & member ID' },
                    { key: 'quickStats', title: 'Action Banner', desc: 'Show quick start workout shortcuts' },
                    { key: 'calculator', title: 'Calorie Estimator', desc: 'Show interactive health metrics calculator' },
                    { key: 'schedule', title: 'Class Timetable', desc: 'Show weekly instructor session schedule' },
                    { key: 'recommended', title: 'Program Recommendations', desc: 'Show featured workouts and diet cards' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3.5 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="pr-4">
                        <span className="font-bold text-slate-900 text-xs block">{item.title}</span>
                        <span className="text-[11px] text-slate-500">{item.desc}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={(preferences as any)[item.key]}
                        onChange={(e) => setPreferences({ ...preferences, [item.key]: e.target.checked })}
                        className="w-4 h-4 text-purple-900 rounded border-slate-300 focus:ring-purple-900"
                      />
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleSavePreferences}
                  className="mt-6 w-full bg-purple-900 hover:bg-purple-950 text-white py-3 rounded-2xl font-bold text-xs transition-colors"
                >
                  Save Layout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Public Landing Page for non-logged-in visitors
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={getImageUrl('home-hero', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')}
            alt="Women fitness studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20 space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-900/60 border border-purple-700/60 text-purple-200 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5" /> Exclusively Dedicated Women's Facility
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-white tracking-tight leading-tight">
            Elevate Your <span className="text-purple-300 italic">Strength</span> & Well-being
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            VIOLET provides a focused, supportive environment designed specifically for women. Combine guided workouts, personalized nutrition plans, and small-group training.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-purple-900 hover:bg-purple-800 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50"
            >
              Join As Member <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/workouts"
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-100 border border-slate-700 px-8 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center"
            >
              Explore Training Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Overview */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-900">Why VIOLET Center</span>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Structured Fitness Tailored For Women</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Everything needed to achieve sustainable personal fitness in an inspiring, comfortable space.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-900">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Dedicated Women-Only Space</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              A private, distraction-free environment built to foster confidence, focus, and camaraderie among members.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-900">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Diverse Training Disciplines</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              From HIIT and Zumba to strength training and mobility sessions, routines adapt to all baseline fitness levels.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-900">
              <Salad className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Targeted Nutrition Protocols</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Practical meal plans for fat loss, muscle building, and overall metabolic health to support your training.
            </p>
          </div>
        </div>
      </section>

      {/* Embedded Health Estimator for Guests */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <FitnessCalculator />
      </section>

      {/* Class Timetable Preview */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <ClassScheduleSection />
      </section>

      {/* Member Testimonial & Transformation */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-purple-900 bg-purple-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Member Experience
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
              "The structured routines and supportive atmosphere helped me build consistent habits."
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              "Finding a studio that balances group energy with personalized coaching made all the difference. In 6 months, my endurance and core strength have improved significantly."
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-purple-900 text-white font-bold text-lg flex items-center justify-center font-serif">
                S
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Sarah Mitchell</p>
                <p className="text-xs text-slate-500">Member for 8 months</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-3 bg-slate-100 p-3 rounded-2xl border border-slate-200">
              <div className="w-1/2 relative rounded-xl overflow-hidden">
                <img
                  src={getImageUrl('before-pic', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop')}
                  alt="Initial baseline"
                  className="w-full h-64 sm:h-80 object-cover grayscale opacity-80"
                />
                <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">Month 1</span>
              </div>
              <div className="w-1/2 relative rounded-xl overflow-hidden">
                <img
                  src={getImageUrl('after-pic', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')}
                  alt="Current progress"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <span className="absolute bottom-3 right-3 bg-purple-900 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">Month 6</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Gallery */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Studio Spaces</span>
              <h2 className="text-3xl font-serif font-bold text-white mt-1">Our Facility & Equipment</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-60 rounded-2xl overflow-hidden bg-slate-900">
              <img src={getImageUrl('home-gal-1', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')} alt="Gym area" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="h-60 rounded-2xl overflow-hidden bg-slate-900">
              <img src={getImageUrl('home-gal-2', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop')} alt="Studio space" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="h-60 rounded-2xl overflow-hidden bg-slate-900">
              <img src={getImageUrl('home-gal-3', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop')} alt="Free weights" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="h-60 rounded-2xl overflow-hidden bg-slate-900">
              <img src={getImageUrl('home-gal-4', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1374&auto=format&fit=crop')} alt="Cardio zone" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
