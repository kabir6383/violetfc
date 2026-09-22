import React, { useState } from 'react';
import { Calculator, Flame, Droplets, HeartPulse } from 'lucide-react';

export default function FitnessCalculator() {
  const [weight, setWeight] = useState<number | ''>(62);
  const [height, setHeight] = useState<number | ''>(165);
  const [activity, setActivity] = useState<'light' | 'moderate' | 'high'>('moderate');
  const [goal, setGoal] = useState<'maintain' | 'loss' | 'gain'>('maintain');

  const calcBmi = () => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (bmi <= 24.9) return { text: 'Optimal Weight', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (bmi <= 29.9) return { text: 'Slightly Over', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { text: 'High Weight', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const calcCalories = () => {
    if (!weight || !height) return 0;
    // BMR formula for women: 447.593 + (9.247 * weight in kg) + (3.098 * height in cm) - (4.330 * age 28)
    const bmr = 447.6 + 9.25 * Number(weight) + 3.1 * Number(height) - 4.3 * 28;
    let multiplier = 1.375;
    if (activity === 'light') multiplier = 1.2;
    if (activity === 'high') multiplier = 1.55;

    let total = Math.round(bmr * multiplier);
    if (goal === 'loss') total -= 350;
    if (goal === 'gain') total += 350;
    return total;
  };

  const calcWater = () => {
    if (!weight) return 2.2;
    return parseFloat((weight * 0.035).toFixed(1));
  };

  const bmi = calcBmi();
  const category = getBmiCategory(bmi);
  const dailyCalories = calcCalories();
  const waterTarget = calcWater();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-3 bg-purple-100/70 text-purple-900 rounded-2xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Personal Health & Calorie Estimator</h3>
          <p className="text-xs text-slate-500">Calculate your daily baseline target based on your metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-slate-900 font-medium text-sm outline-none"
                placeholder="60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-slate-900 font-medium text-sm outline-none"
                placeholder="165"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Activity Level</label>
            <select
              value={activity}
              onChange={(e: any) => setActivity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-slate-900 font-medium text-sm bg-white outline-none"
            >
              <option value="light">Light (1-2 workouts/week)</option>
              <option value="moderate">Moderate (3-4 workouts/week)</option>
              <option value="high">High Energy (5+ workouts/week)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Fitness Objective</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGoal('loss')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  goal === 'loss' ? 'bg-purple-900 text-white border-purple-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Fat Loss
              </button>
              <button
                type="button"
                onClick={() => setGoal('maintain')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  goal === 'maintain' ? 'bg-purple-900 text-white border-purple-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Maintain
              </button>
              <button
                type="button"
                onClick={() => setGoal('gain')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  goal === 'gain' ? 'bg-purple-900 text-white border-purple-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Muscle Gain
              </button>
            </div>
          </div>
        </div>

        {/* Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-900 text-purple-100 rounded-xl">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-purple-900 font-semibold uppercase tracking-wider block">Body Mass Index</span>
                <span className="text-2xl font-bold text-slate-900">{bmi || '--'}</span>
              </div>
            </div>
            {bmi > 0 && (
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${category.color}`}>
                {category.text}
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-600 text-white rounded-xl">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-amber-900 font-semibold uppercase tracking-wider block">Daily Calorie Target</span>
                <span className="text-2xl font-bold text-slate-900">{dailyCalories ? `${dailyCalories} kcal` : '--'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-600 text-white rounded-xl">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-sky-900 font-semibold uppercase tracking-wider block">Recommended Hydration</span>
                <span className="text-2xl font-bold text-slate-900">{waterTarget} Liters</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
