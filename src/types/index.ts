export interface User {
  id: number;
  name: string;
  age: number;
  phone: string;
  email: string;
  role: 'admin' | 'user';
  is_paid: number;
}

export interface Workout {
  id: string;
  title: string;
  category: 'aerobic' | 'anaerobic' | 'lite-apparatus' | 'zumba' | 'own-body';
  description: string;
  duration: string;
  intensity: 'Beginner' | 'Intermediate' | 'Advanced';
  targetArea: string;
  imageId: string;
  defaultImage: string;
  videoUrl: string;
  caloriesBurnEstimate: number;
}

export interface NutritionPlan {
  id: string;
  title: string;
  category: 'weight-loss' | 'weight-gain' | 'health-conscious' | 'wellness';
  description: string;
  calorieTarget: string;
  macroRatio: string;
  sampleMeals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
  imageId: string;
  defaultImage: string;
}

export interface ImageRecord {
  id: string;
  section: string;
  title: string;
  url: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ClassScheduleItem {
  id: string;
  day: string;
  time: string;
  className: string;
  instructor: string;
  spotsLeft: number;
}
