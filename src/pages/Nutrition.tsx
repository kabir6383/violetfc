import React from 'react';
import { Apple, Scale, ShieldCheck, Leaf } from 'lucide-react';
import { useImages } from '../context/ImageContext';

const basePlans = [
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    description: 'Calorie-deficit plans focusing on high protein and fiber to keep you full while shedding unwanted fat safely.',
    icon: <Scale className="w-8 h-8 text-blue-500" />,
    imageId: 'nutri-weight-loss',
    defaultImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop',
    color: 'bg-blue-50 border-blue-100'
  },
  {
    id: 'weight-gain',
    title: 'Weight Gain',
    description: 'Nutrient-dense, calorie-surplus meal plans designed to help you build muscle mass and healthy weight.',
    icon: <Apple className="w-8 h-8 text-rose-500" />,
    imageId: 'nutri-weight-gain',
    defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop',
    color: 'bg-rose-50 border-rose-100'
  },
  {
    id: 'health-conscious',
    title: 'Health Conscious',
    description: 'Balanced nutrition focusing on whole foods, vitamins, and minerals for optimal body function and energy.',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
    imageId: 'nutri-health',
    defaultImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop',
    color: 'bg-emerald-50 border-emerald-100'
  },
  {
    id: 'wellness',
    title: 'Wellness & Recovery',
    description: 'Anti-inflammatory diets rich in antioxidants to support recovery, mental clarity, and overall wellbeing.',
    icon: <Leaf className="w-8 h-8 text-teal-500" />,
    imageId: 'nutri-wellness',
    defaultImage: 'https://images.unsplash.com/photo-1478144592103-25e218a04891?q=80&w=1375&auto=format&fit=crop',
    color: 'bg-teal-50 border-teal-100'
  }
];

export default function Nutrition() {
  const { getImageUrl } = useImages();

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">Nutrition & Diet</h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Fuel your body right. Our expert-designed nutrition plans complement your workouts to help you achieve lasting results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {basePlans.map((plan) => (
            <div key={plan.id} className={`flex flex-col md:flex-row rounded-2xl overflow-hidden border ${plan.color} shadow-sm hover:shadow-md transition-all group bg-white`}>
              <div className="md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                <img 
                  src={getImageUrl(plan.imageId, plan.defaultImage)} 
                  alt={plan.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 md:w-3/5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-stone-50 rounded-lg shadow-sm">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900">{plan.title}</h3>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  {plan.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
