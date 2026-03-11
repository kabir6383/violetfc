import React, { useState } from 'react';
import { Activity, Dumbbell, Flame, Heart, Zap, PlayCircle, X } from 'lucide-react';
import { useImages } from '../context/ImageContext';

const baseWorkouts = [
  {
    id: 'aerobic',
    title: 'Aerobic',
    description: 'High-energy cardiovascular workouts designed to improve heart health, stamina, and burn calories efficiently.',
    icon: <Heart className="w-8 h-8 text-rose-500" />,
    imageId: 'workout-aerobic',
    defaultImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/ml6cT4AZdqI',
    color: 'bg-rose-50 border-rose-100'
  },
  {
    id: 'anaerobic',
    title: 'Anaerobic',
    description: 'Short, intense bursts of exercise like sprinting or heavy weightlifting to build muscle mass and power.',
    icon: <Zap className="w-8 h-8 text-amber-500" />,
    imageId: 'workout-anaerobic',
    defaultImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/OQSmOQ2F5tU',
    color: 'bg-amber-50 border-amber-100'
  },
  {
    id: 'lite-apparatus',
    title: 'Lite Apparatus',
    description: 'Guided workouts using light equipment like resistance bands, light dumbbells, and stability balls for toning.',
    icon: <Dumbbell className="w-8 h-8 text-violet-500" />,
    imageId: 'workout-lite',
    defaultImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/U0bhE67HuDY',
    color: 'bg-violet-50 border-violet-100'
  },
  {
    id: 'zumba',
    title: 'Zumba',
    description: 'Fun, dance-based fitness program combining Latin and international music with dance moves.',
    icon: <Flame className="w-8 h-8 text-orange-500" />,
    imageId: 'workout-zumba',
    defaultImage: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=1470&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/8DZktowZo_k',
    color: 'bg-orange-50 border-orange-100'
  },
  {
    id: 'own-body',
    title: 'Own Body Workout',
    description: 'Calisthenics and bodyweight exercises that require no equipment, focusing on flexibility, balance, and core strength.',
    icon: <Activity className="w-8 h-8 text-emerald-500" />,
    imageId: 'workout-own',
    defaultImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/CBWQGb4LyAM',
    color: 'bg-emerald-50 border-emerald-100'
  }
];

export default function Workouts() {
  const { getImageUrl } = useImages();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">Workout Styles</h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Discover a variety of training methods tailored to your fitness goals. Whether you want to dance, lift, or flow, we have something for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {baseWorkouts.map((workout) => (
            <div key={workout.id} className={`rounded-2xl overflow-hidden border ${workout.color} shadow-sm hover:shadow-md transition-all group flex flex-col`}>
              <div className="h-56 overflow-hidden relative bg-black">
                {activeVideo === workout.id ? (
                  <iframe 
                    className="w-full h-full"
                    src={`${workout.videoUrl}?autoplay=1`} 
                    title={workout.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <img 
                      src={getImageUrl(workout.imageId, workout.defaultImage)} 
                      alt={workout.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                      <button 
                        onClick={() => setActiveVideo(workout.id)}
                        className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-4 transition-all transform hover:scale-110"
                      >
                        <PlayCircle className="w-12 h-12" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white p-2 rounded-xl shadow-sm">
                      {workout.icon}
                    </div>
                  </>
                )}
              </div>
              <div className="p-6 bg-white flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-stone-900">{workout.title}</h3>
                  {activeVideo === workout.id && (
                    <button 
                      onClick={() => setActiveVideo(null)}
                      className="text-stone-400 hover:text-rose-500 transition-colors"
                      title="Close Video"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-stone-600 leading-relaxed flex-grow">
                  {workout.description}
                </p>
                {activeVideo !== workout.id && (
                  <button 
                    onClick={() => setActiveVideo(workout.id)}
                    className="mt-4 w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5" /> Watch Video
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
