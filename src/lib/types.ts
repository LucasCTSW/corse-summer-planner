
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
  customOptions?: { [stepName: string]: FormOption[] };
  [key: string]: any; // Permet d'ajouter des propriétés dynamiques pour les questions personnalisées
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
  addedBy?: string;
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
  | 'summary'
  | string; // Permet les types personnalisés pour les nouvelles questions
