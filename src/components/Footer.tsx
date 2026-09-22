import React from 'react';
import { Dumbbell, MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-900 border border-purple-700 flex items-center justify-center text-purple-200">
                <Dumbbell className="h-5 w-5" />
              </div>
              <span className="font-serif font-extrabold text-2xl text-white tracking-wider">VIOLET</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              A dedicated women-only training center focused on empowering physical strength, proper nutrition, and sustainable well-being.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/60 border border-purple-900/50 px-3 py-1.5 rounded-lg w-fit">
              <Shield className="w-3.5 h-3.5" />
              <span>Women Only Dedicated Facility</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-purple-300 transition-colors">Home Overview</Link>
              </li>
              <li>
                <Link to="/workouts" className="hover:text-purple-300 transition-colors">Training Programs</Link>
              </li>
              <li>
                <Link to="/nutrition" className="hover:text-purple-300 transition-colors">Diet & Meal Plans</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-purple-300 transition-colors">Membership Inquiry</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-purple-300 transition-colors">Member Portal</Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" /> Facility Hours
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between border-b border-slate-900 pb-2">
                <span>Monday - Friday</span>
                <span className="text-slate-200 font-medium">06:00 AM - 09:30 PM</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-2">
                <span>Saturday</span>
                <span className="text-slate-200 font-medium">07:30 AM - 07:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-slate-200 font-medium">08:00 AM - 04:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Contact Front Desk</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                <span>450 Wellness Avenue, Suite 12, New York, NY 10018</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>+1 (800) 450-8465</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>contact@violetfitnesscenter.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} VIOLET Fitness Center. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Facility Guidelines</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Membership</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
