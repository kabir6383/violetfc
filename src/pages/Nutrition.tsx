import React, { useState } from 'react';
import { Scale, Apple, ShieldCheck, Leaf, PieChart, FileText, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { useImages } from '../context/ImageContext';
import { useToast } from '../context/ToastContext';
import { NutritionPlan } from '../types';

const basePlans: NutritionPlan[] = [
  {
    id: 'weight-loss',
    title: 'Fat Loss Protocol',
    category: 'weight-loss',
    description: 'Controlled calorie deficit plans focused on lean protein, complex fibers, and volume eating to stay full while reducing fat safely.',
    calorieTarget: '1,400 - 1,600 kcal/day',
    macroRatio: '35% Protein | 40% Carbs | 25% Fats',
    sampleMeals: {
      breakfast: 'Greek yogurt parfait with mixed berries, chia seeds, and sliced almonds',
      lunch: 'Grilled chicken breast salad with avocado, cherry tomatoes, and olive oil vinaigrette',
      dinner: 'Baked salmon with steamed broccoli and wild brown rice',
      snack: 'Apple slices with almond butter or hard-boiled eggs',
    },
    imageId: 'nutri-weight-loss',
    defaultImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop',
  },
  {
    id: 'weight-gain',
    title: 'Lean Muscle Build Plan',
    category: 'weight-gain',
    description: 'Calorie surplus meal structure emphasizing high-protein intake and nutrient-dense whole food sources to build lean muscle mass.',
    calorieTarget: '2,200 - 2,500 kcal/day',
    macroRatio: '30% Protein | 50% Carbs | 20% Fats',
    sampleMeals: {
      breakfast: 'Oatmeal bowl with banana, whey protein powder, honey, and peanut butter',
      lunch: 'Lean ground turkey with quinoa, roasted sweet potatoes, and avocado',
      dinner: 'Grilled steak loin with roasted potatoes and asparagus',
      snack: 'Cottage cheese with walnuts or a fruit & protein smoothie',
    },
    imageId: 'nutri-weight-gain',
    defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop',
  },
  {
    id: 'health-conscious',
    title: 'Vitality & Whole Foods Protocol',
    category: 'health-conscious',
    description: 'Balanced maintenance plan rich in phytonutrients, clean grains, and healthy fats designed to support steady daily energy levels.',
    calorieTarget: '1,800 - 2,000 kcal/day',
    macroRatio: '25% Protein | 45% Carbs | 30% Fats',
    sampleMeals: {
      breakfast: 'Whole grain toast with mashed avocado, poached egg, and microgreens',
      lunch: 'Quinoa & chickpea Mediterranean bowl with feta cheese and cucumbers',
      dinner: 'Pan-seared cod with roasted zucchini and quinoa pilaf',
      snack: 'Mixed raw nuts and dark chocolate (85%)',
    },
    imageId: 'nutri-health',
    defaultImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 'wellness',
    title: 'Anti-Inflammatory & Recovery Plan',
    category: 'wellness',
    description: 'Antioxidant-dense nutrition incorporating green tea, leafy greens, berries, and omega-3 oils to accelerate post-workout muscle recovery.',
    calorieTarget: '1,700 - 1,900 kcal/day',
    macroRatio: '25% Protein | 45% Carbs | 30% Fats',
    sampleMeals: {
      breakfast: 'Green smoothie with spinach, frozen pineapple, ginger, and flaxseed',
      lunch: 'Lentil and kale soup with warm sourdough and extra virgin olive oil',
      dinner: 'Grilled wild salmon with turmeric-spiced cauliflower rice',
      snack: 'Fresh blueberries and green tea',
    },
    imageId: 'nutri-wellness',
    defaultImage: 'https://images.unsplash.com/photo-1478144592103-25e218a04891?q=80&w=1375&auto=format&fit=crop',
  },
];

export default function Nutrition() {
  const { getImageUrl } = useImages();
  const { showToast } = useToast();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>('weight-loss');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Meal Plans' },
    { id: 'weight-loss', label: 'Fat Loss' },
    { id: 'weight-gain', label: 'Muscle Gain' },
    { id: 'health-conscious', label: 'Vitality' },
    { id: 'wellness', label: 'Recovery' },
  ];

  const filteredPlans = basePlans.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const handleDownloadPlan = (title: string) => {
    showToast(`PDF meal overview generated for ${title}`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Nutritional Guidance
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">Tailored Meal Protocols</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Nourish your body for performance and recovery. Explore structured nutrition protocols engineered to complement your physical training.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex gap-2 overflow-x-auto justify-start md:justify-center scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl overflow-hidden border transition-all shadow-sm flex flex-col justify-between ${
                  isSelected ? 'border-emerald-700 ring-1 ring-emerald-700/50' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
                    <img
                      src={getImageUrl(plan.imageId, plan.defaultImage)}
                      alt={plan.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 sm:w-3/5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full">
                        {plan.calorieTarget}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 leading-snug">{plan.title}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                        <PieChart className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{plan.macroRatio}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Sample Daily Menu */}
                <div className="p-6 bg-slate-50/70 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-800" /> Sample Daily Menu Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-900 block text-[11px]">Breakfast:</span>
                      <span className="text-slate-600 leading-snug block">{plan.sampleMeals.breakfast}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-900 block text-[11px]">Lunch:</span>
                      <span className="text-slate-600 leading-snug block">{plan.sampleMeals.lunch}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-900 block text-[11px]">Dinner:</span>
                      <span className="text-slate-600 leading-snug block">{plan.sampleMeals.dinner}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-900 block text-[11px]">Snack Option:</span>
                      <span className="text-slate-600 leading-snug block">{plan.sampleMeals.snack}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleDownloadPlan(plan.title)}
                      className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Save Plan Overview
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
