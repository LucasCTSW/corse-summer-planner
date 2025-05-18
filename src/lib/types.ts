
export interface User {
  name: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  meals: string[];
  allergies: string[];
  breakfast: string[];
  drinks: string[];
  activities: string[];
  budget: string;
  items: string[];
  customMessage?: string;
}

export interface AttendanceInfo {
  name: string;
  startDate: string;
  endDate: string;
  transport: string;
  transportIcon: string;
}

export interface FormOption {
  id: string;
  label: string;
  emoji?: string;
}

export type StepName = 
  | 'user-selection'
  | 'meals'
  | 'allergies'
  | 'breakfast'
  | 'drinks'
  | 'activities'
  | 'budget'
  | 'items'
  | 'summary';
