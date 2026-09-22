import React, { useState } from 'react';
import { Activity, Dumbbell, Flame, Heart, Zap, PlayCircle, X, Search, CheckCircle2, Clock, Target } from 'lucide-react';
import { useImages } from '../context/ImageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Workout } from '../types';

const baseWorkouts: Workout[] = [
  {
    id: 'aerobic',
    title: 'Aerobic & Endurance Cardio',
    category: 'aerobic',
    description: 'Rhythmic cardiovascular routines to boost heart rate, improve stamina, and support fat burn through continuous motion.',
    duration: '45 mins',
    intensity: 'Intermediate',
    targetArea: 'Full Body & Heart',
    imageId: 'workout-aerobic',
    defaultImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/ml6cT4AZdqI',
    caloriesBurnEstimate: 380,
  },
  {
    id: 'anaerobic',
    title: 'Anaerobic Strength & Intervals',
    category: 'anaerobic',
    description: 'Targeted high-intensity intervals and strength conditioning designed to build lean muscle tone and boost metabolic rate.',
    duration: '35 mins',
    intensity: 'Advanced',
    targetArea: 'Glutes, Legs & Core',
    imageId: 'workout-anaerobic',
    defaultImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/OQSmOQ2F5tU',
    caloriesBurnEstimate: 420,
  },
  {
    id: 'lite-apparatus',
    title: 'Resistance & Apparatus Sculpt',
    category: 'lite-apparatus',
    description: 'Controlled resistance workouts using light dumbbells, resistance loops, and stability equipment to sculpt muscle groups safely.',
    duration: '40 mins',
    intensity: 'Beginner',
    targetArea: 'Arms, Back & Posture',
    imageId: 'workout-lite',
    defaultImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/U0bhE67HuDY',
    caloriesBurnEstimate: 290,
  },
  {
    id: 'zumba',
    title: 'Zumba & Rhythm Dance',
    category: 'zumba',
    description: 'High-energy dance movement set to Latin and global beats. Combines fun choreography with effective cardiovascular exercise.',
    duration: '50 mins',
    intensity: 'Intermediate',
    targetArea: 'Full Body Coordination',
    imageId: 'workout-zumba',
    defaultImage: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=1470&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/8DZktowZo_k',
    caloriesBurnEstimate: 450,
  },
  {
    id: 'own-body',
    title: 'Bodyweight Calisthenics & Mobility',
    category: 'own-body',
    description: 'Functional movement training using your own bodyweight to enhance joint flexibility, core balance, and posture strength.',
    duration: '30 mins',
    intensity: 'Beginner',
    targetArea: 'Core & Mobility',
    imageId: 'workout-own',
    defaultImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/CBWQGb4LyAM',
    caloriesBurnEstimate: 260,
  },
];

export default function Workouts() {
  const { getImageUrl } = useImages();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loggedWorkoutIds, setLoggedWorkoutIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'All Routines' },
    { id: 'aerobic', label: 'Cardio & Aerobic' },
    { id: 'anaerobic', label: 'Strength & HIIT' },
    { id: 'lite-apparatus', label: 'Resistance Sculpt' },
    { id: 'zumba', label: 'Dance & Rhythm' },
    { id: 'own-body', label: 'Core & Bodyweight' },
  ];

  const filteredWorkouts = baseWorkouts.filter((workout) => {
    const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
    const matchesSearch =
      workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.targetArea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLogWorkout = (workout: Workout) => {
    if (!user) {
      showToast('Please sign in to log workouts to your account', 'info');
      return;
    }
    if (!loggedWorkoutIds.includes(workout.id)) {
      setLoggedWorkoutIds([...loggedWorkoutIds, workout.id]);
      showToast(`Logged session: ${workout.title} (+${workout.caloriesBurnEstimate} kcal)`, 'success');
    } else {
      setLoggedWorkoutIds(loggedWorkoutIds.filter((id) => id !== workout.id));
      showToast(`Removed session log for ${workout.title}`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
            Training Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">Structured Workout Programs</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Select from cardio, strength intervals, resistance sculpt, dance, and mobility routines designed for women.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto max-w-full w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search routines or muscle group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-900 focus:ring-1 focus:ring-purple-900 bg-slate-50"
            />
          </div>
        </div>

        {/* Workouts Grid */}
        {filteredWorkouts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500">
            <p className="font-semibold text-base">No workouts match your filter criteria.</p>
            <p className="text-xs mt-1">Try searching for another term or selecting "All Routines".</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkouts.map((workout) => {
              const isLogged = loggedWorkoutIds.includes(workout.id);
              return (
                <div
                  key={workout.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Media Section */}
                  <div className="h-60 overflow-hidden relative bg-slate-900">
                    {activeVideoId === workout.id ? (
                      <div className="relative w-full h-full">
                        <iframe
                          className="w-full h-full"
                          src={`${workout.videoUrl}?autoplay=1`}
                          title={workout.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        <button
                          onClick={() => setActiveVideoId(null)}
                          className="absolute top-3 right-3 bg-slate-950/80 text-white p-2 rounded-full hover:bg-rose-900 transition-colors z-10"
                          title="Close Video"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <img
                          src={getImageUrl(workout.imageId, workout.defaultImage)}
                          alt={workout.title}
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-center justify-center">
                          <button
                            onClick={() => setActiveVideoId(workout.id)}
                            className="bg-purple-900/80 hover:bg-purple-800 text-white rounded-full p-4 transition-all transform hover:scale-110 border border-purple-500/40 shadow-lg"
                          >
                            <PlayCircle className="w-10 h-10" />
                          </button>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm text-slate-200 px-3 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border border-slate-800">
                          <Clock className="w-3 h-3 text-purple-300" />
                          <span>{workout.duration}</span>
                          <span className="mx-1">•</span>
                          <Flame className="w-3 h-3 text-amber-400" />
                          <span>~{workout.caloriesBurnEstimate} kcal</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xl font-bold text-slate-900 leading-snug">{workout.title}</h3>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-950 px-2.5 py-0.5 rounded-full shrink-0">
                          {workout.intensity}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{workout.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Target className="w-3.5 h-3.5 text-purple-900 shrink-0" />
                        <span>Target: {workout.targetArea}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setActiveVideoId(activeVideoId === workout.id ? null : workout.id)}
                          className="py-2.5 px-3 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <PlayCircle className="w-4 h-4 text-purple-900" />
                          {activeVideoId === workout.id ? 'Close' : 'Watch Routine'}
                        </button>
                        <button
                          onClick={() => handleLogWorkout(workout)}
                          className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isLogged
                              ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                              : 'bg-purple-900 text-white hover:bg-purple-950 shadow-sm'
                          }`}
                        >
                          {isLogged ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> Logged
                            </>
                          ) : (
                            'Log Session'
                          )}
                        </button>
                      </div>
                    </div>
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
