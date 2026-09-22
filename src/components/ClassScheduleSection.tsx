import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { ClassScheduleItem } from '../types';
import { useToast } from '../context/ToastContext';

const scheduleData: ClassScheduleItem[] = [
  { id: '1', day: 'Monday', time: '07:00 AM', className: 'Sunrise Yoga & Mobility', instructor: 'Elena Rostova', spotsLeft: 4 },
  { id: '2', day: 'Monday', time: '05:30 PM', className: 'HIIT & Burn', instructor: 'Maya Lin', spotsLeft: 2 },
  { id: '3', day: 'Tuesday', time: '08:30 AM', className: 'Pilates Reformer Core', instructor: 'Clara Vance', spotsLeft: 5 },
  { id: '4', day: 'Tuesday', time: '06:00 PM', className: 'Zumba Dance Cardio', instructor: 'Sofia Garcia', spotsLeft: 8 },
  { id: '5', day: 'Wednesday', time: '07:00 AM', className: 'Bodyweight Strength', instructor: 'Maya Lin', spotsLeft: 3 },
  { id: '6', day: 'Wednesday', time: '05:00 PM', className: 'Lite Apparatus Toning', instructor: 'Elena Rostova', spotsLeft: 6 },
  { id: '7', day: 'Thursday', time: '08:30 AM', className: 'Cardio Kickboxing', instructor: 'Sofia Garcia', spotsLeft: 1 },
  { id: '8', day: 'Thursday', time: '06:30 PM', className: 'Deep Stretch & Release', instructor: 'Clara Vance', spotsLeft: 7 },
  { id: '9', day: 'Friday', time: '07:30 AM', className: 'Full Body Conditioning', instructor: 'Maya Lin', spotsLeft: 4 },
  { id: '10', day: 'Saturday', time: '09:00 AM', className: 'Weekend Power Flow', instructor: 'Elena Rostova', spotsLeft: 3 },
];

export default function ClassScheduleSection() {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [bookedIds, setBookedIds] = useState<string[]>([]);
  const { showToast } = useToast();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filteredSchedule = scheduleData.filter((item) => item.day === selectedDay);

  const handleBook = (item: ClassScheduleItem) => {
    if (bookedIds.includes(item.id)) {
      setBookedIds(bookedIds.filter((id) => id !== item.id));
      showToast(`Cancelled reservation for ${item.className}`, 'info');
    } else {
      setBookedIds([...bookedIds, item.id]);
      showToast(`Spot reserved for ${item.className} on ${item.day} at ${item.time}!`, 'success');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-900" />
            Weekly Studio Schedule
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Reserve your spot in small-group instructor sessions</p>
        </div>

        {/* Day Selector */}
        <div className="flex gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDay === d
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Class list */}
      <div className="space-y-3">
        {filteredSchedule.map((item) => {
          const isBooked = bookedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isBooked
                  ? 'bg-purple-50/60 border-purple-200'
                  : 'bg-slate-50/50 border-slate-200/70 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-900/10 text-purple-900 font-medium text-xs flex items-center gap-1.5 shrink-0 mt-0.5 sm:mt-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{item.className}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {item.instructor}
                    </span>
                    <span>•</span>
                    <span className="text-amber-700 font-medium">{item.spotsLeft} spots available</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleBook(item)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isBooked
                    ? 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800'
                    : 'bg-purple-900 text-white hover:bg-purple-950 shadow-sm'
                }`}
              >
                {isBooked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Reserved
                  </>
                ) : (
                  'Book Spot'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
