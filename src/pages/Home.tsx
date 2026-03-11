import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, HeartPulse, Activity, Salad, CheckCircle, AlertCircle, PlayCircle, Settings, X } from 'lucide-react';
import { useImages } from '../context/ImageContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { getImageUrl } = useImages();
  const { user } = useAuth();

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [preferences, setPreferences] = useState(() => {
    if (user) {
      const saved = localStorage.getItem(`violet_prefs_${user.id}`);
      if (saved) return JSON.parse(saved);
    }
    return {
      membership: true,
      quickStats: true,
      recommended: true
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`violet_prefs_${user.id}`, JSON.stringify(preferences));
    }
  }, [preferences, user]);

  if (user) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Welcome back, {user.name}!</h1>
              <p className="text-stone-600 mt-2">Here is your fitness overview for today.</p>
            </div>
            <button 
              onClick={() => setIsCustomizing(true)}
              className="flex items-center gap-2 bg-white border border-stone-200 text-stone-600 px-4 py-2 rounded-lg hover:bg-stone-50 transition-colors shadow-sm text-sm font-medium"
            >
              <Settings className="w-4 h-4" /> Customize Dashboard
            </button>
          </div>

          {(preferences.membership || preferences.quickStats) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Membership Status */}
              {preferences.membership && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-800 mb-2">Membership Status</h3>
                    {user.is_paid ? (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Active & Paid</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Payment Pending</span>
                      </div>
                    )}
                  </div>
                  {!user.is_paid && (
                    <p className="text-sm text-stone-500 mt-4">Please complete your payment at the front desk to unlock all facility access.</p>
                  )}
                </div>
              )}

              {/* Quick Stats / Info */}
              {preferences.quickStats && (
                <div className={`bg-violet-600 rounded-2xl p-6 shadow-sm text-white flex flex-col justify-between relative overflow-hidden ${preferences.membership ? 'md:col-span-2' : 'md:col-span-3'}`}>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">Ready for your next session?</h3>
                    <p className="text-violet-200 max-w-md mb-6">Consistency is key. Check out our latest workout routines and keep pushing your limits.</p>
                    <div className="flex gap-4">
                      <Link to="/workouts" className="bg-white text-violet-600 px-5 py-2 rounded-lg font-medium hover:bg-stone-100 transition-colors flex items-center gap-2">
                        <PlayCircle className="w-5 h-5" /> Start Workout
                      </Link>
                    </div>
                  </div>
                  <HeartPulse className="absolute -right-4 -bottom-4 w-48 h-48 text-violet-500 opacity-50" />
                </div>
              )}
            </div>
          )}

          {preferences.recommended && (
            <>
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Workout Teaser */}
                <Link to="/workouts" className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-md transition-all flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                    <img src={getImageUrl('workout-aerobic', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop')} alt="Workout" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-rose-500 mb-2">
                      <Activity className="w-5 h-5" />
                      <span className="font-semibold text-sm uppercase tracking-wider">Workout Plan</span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Aerobic & Cardio</h3>
                    <p className="text-stone-600 text-sm mb-4">High-energy cardiovascular workouts designed to improve heart health and stamina.</p>
                    <span className="text-violet-600 font-medium flex items-center gap-1 text-sm group-hover:gap-2 transition-all">View all workouts <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </Link>

                {/* Nutrition Teaser */}
                <Link to="/nutrition" className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-md transition-all flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                    <img src={getImageUrl('nutri-health', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop')} alt="Nutrition" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-emerald-500 mb-2">
                      <Salad className="w-5 h-5" />
                      <span className="font-semibold text-sm uppercase tracking-wider">Diet Plan</span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Health Conscious</h3>
                    <p className="text-stone-600 text-sm mb-4">Balanced nutrition focusing on whole foods, vitamins, and minerals for optimal energy.</p>
                    <span className="text-violet-600 font-medium flex items-center gap-1 text-sm group-hover:gap-2 transition-all">View all diet plans <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </Link>
              </div>
            </>
          )}

          {/* Customization Modal */}
          {isCustomizing && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-stone-900">Customize Dashboard</h3>
                  <button onClick={() => setIsCustomizing(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium text-stone-900">Membership Status</span>
                      <span className="text-sm text-stone-500">Show your payment and active status</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-stone-200">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={preferences.membership} 
                        onChange={(e) => setPreferences({...preferences, membership: e.target.checked})} 
                      />
                      <span className="absolute inset-0 rounded-full bg-stone-200 transition peer-checked:bg-violet-600"></span>
                      <span className="absolute inset-y-1 left-1 w-4 h-4 rounded-full bg-white transition-all peer-checked:left-7"></span>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium text-stone-900">Quick Actions</span>
                      <span className="text-sm text-stone-500">Show motivation and quick links</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-stone-200">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={preferences.quickStats} 
                        onChange={(e) => setPreferences({...preferences, quickStats: e.target.checked})} 
                      />
                      <span className="absolute inset-0 rounded-full bg-stone-200 transition peer-checked:bg-violet-600"></span>
                      <span className="absolute inset-y-1 left-1 w-4 h-4 rounded-full bg-white transition-all peer-checked:left-7"></span>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium text-stone-900">Recommended Plans</span>
                      <span className="text-sm text-stone-500">Show suggested workouts and diets</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-stone-200">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={preferences.recommended} 
                        onChange={(e) => setPreferences({...preferences, recommended: e.target.checked})} 
                      />
                      <span className="absolute inset-0 rounded-full bg-stone-200 transition peer-checked:bg-violet-600"></span>
                      <span className="absolute inset-y-1 left-1 w-4 h-4 rounded-full bg-white transition-all peer-checked:left-7"></span>
                    </div>
                  </label>
                </div>
                <button 
                  onClick={() => setIsCustomizing(false)} 
                  className="mt-8 w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl('home-hero', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')} 
            alt="Women working out" 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/80 to-black/50" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Empower Your <span className="text-violet-400">Strength</span>
          </h1>
          <p className="text-xl text-stone-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            VIOLET is an exclusive fitness center designed for women. Build confidence, achieve your goals, and join a supportive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-500/30">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/workouts" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center">
              Explore Workouts
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Why Choose VIOLET?</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">We provide a holistic approach to fitness, combining expert-led workouts with personalized nutrition plans.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-6 text-violet-600">
              <HeartPulse className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">Women Only Space</h3>
            <p className="text-stone-600 leading-relaxed">
              A comfortable, judgment-free environment designed specifically for women to train and thrive together.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-6 text-violet-600">
              <Activity className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">Diverse Workouts</h3>
            <p className="text-stone-600 leading-relaxed">
              From high-energy Zumba to strength-building Anaerobic sessions, find the perfect routine for your goals.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-6 text-violet-600">
              <Salad className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">Diet Maintenance</h3>
            <p className="text-stone-600 leading-relaxed">
              Comprehensive nutrition plans for weight loss, weight gain, or general wellness to complement your training.
            </p>
          </div>
        </div>
      </section>

      {/* Transformations Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto bg-white rounded-3xl mb-24 shadow-sm border border-stone-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Real Women, Real Results</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">See the incredible transformations of our members who committed to their health and fitness journey with VIOLET.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center px-4 sm:px-8">
          <div className="relative">
            <div className="flex gap-2 overflow-hidden rounded-2xl shadow-lg bg-stone-200 p-2">
              <div className="w-1/2 relative rounded-xl overflow-hidden">
                <img src={getImageUrl('before-pic', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop')} alt="Before" className="w-full h-[300px] sm:h-[400px] object-cover grayscale opacity-80" referrerPolicy="no-referrer" />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">Before</div>
              </div>
              <div className="w-1/2 relative rounded-xl overflow-hidden">
                <img src={getImageUrl('after-pic', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')} alt="After" className="w-full h-[300px] sm:h-[400px] object-cover" referrerPolicy="no-referrer" />
                <div className="absolute bottom-4 right-4 bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">After</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="text-emerald-500 bg-emerald-50 p-2 rounded-full">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-stone-500 font-medium">Weight Loss</p>
                  <p className="text-xl font-bold text-stone-900">-24 lbs</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-violet-600 mb-4">
              <HeartPulse className="w-6 h-6" />
              <span className="font-semibold tracking-wider uppercase text-sm">Success Story</span>
            </div>
            <h3 className="text-3xl font-bold text-stone-900 mb-4">"I found my strength and my community."</h3>
            <p className="text-stone-600 leading-relaxed mb-6 text-lg">
              "Before joining VIOLET, I struggled with consistency and felt intimidated by traditional gyms. The supportive, women-only environment completely changed my perspective. Through a combination of Aerobic classes and the personalized nutrition plan, I've not only transformed my body but also my confidence."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-200 rounded-full flex items-center justify-center text-violet-700 font-bold text-xl">
                S
              </div>
              <div>
                <p className="font-bold text-stone-900">Sarah Jenkins</p>
                <p className="text-stone-500 text-sm">Member for 8 months</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Facility</h2>
              <p className="text-stone-400 max-w-xl">State-of-the-art equipment in a beautifully designed space that inspires you to push your limits.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img src={getImageUrl('home-gal-1', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')} alt="Gym equipment" className="w-full h-64 object-cover rounded-xl" referrerPolicy="no-referrer" />
            <img src={getImageUrl('home-gal-2', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop')} alt="Yoga studio" className="w-full h-64 object-cover rounded-xl" referrerPolicy="no-referrer" />
            <img src={getImageUrl('home-gal-3', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop')} alt="Weights area" className="w-full h-64 object-cover rounded-xl" referrerPolicy="no-referrer" />
            <img src={getImageUrl('home-gal-4', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1374&auto=format&fit=crop')} alt="Cardio machines" className="w-full h-64 object-cover rounded-xl" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>
    </div>
  );
}
