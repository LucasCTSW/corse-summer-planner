import { UserPreferences, FormOption } from "./types";

export function generatePersonalizedMessage(preferences: UserPreferences): string {
  const { meals, drinks, activities, budget } = preferences;
  
  // Check for special combinations
  if (drinks.includes("rose") && meals.includes("raclette") && drinks.includes("jagermeister")) {
    return "Prévois un foie de secours 🍻";
  }
  
  if (meals.length === 0 && drinks.length === 0 && activities.length === 0 && !budget) {
    return "T'as coché quoi en fait ? 😂";
  }
  
  if (meals.length >= 5 && drinks.length >= 5 && activities.length >= 5) {
    return "Tu veux pas qu'on parte avec un traiteur aussi ? 😅";
  }
  
  if (budget === "tight" && !activities.includes("chill")) {
    return "Bonnes vacances Mamie 👵";
  }
  
  if (activities.includes("chill") && meals.includes("bbq") && drinks.includes("beer")) {
    return "Des vacances à la cool 🍻";
  }
  
  // Default message
  return "Ton profil est enregistré ! À bientôt en Corse ! 🏝️";
}

export function saveUserPreferences(userName: string, preferences: UserPreferences): void {
  try {
    // Get existing data or initialize empty object
    const existingData = localStorage.getItem('corsicaTripUsers');
    const usersData = existingData ? JSON.parse(existingData) : {};
    
    // Update or add user preferences
    usersData[userName] = {
      ...preferences,
      customMessage: generatePersonalizedMessage(preferences)
    };
    
    // Save back to localStorage
    localStorage.setItem('corsicaTripUsers', JSON.stringify(usersData));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
}

export function getUserPreferences(userName: string): UserPreferences | null {
  try {
    const existingData = localStorage.getItem('corsicaTripUsers');
    if (!existingData) return null;
    
    const usersData = JSON.parse(existingData);
    return usersData[userName] || null;
  } catch (error) {
    console.error('Error retrieving user preferences:', error);
    return null;
  }
}

export function getGlobalCustomOptions(stepName: string): FormOption[] {
  try {
    const existingData = localStorage.getItem('corsicaTripUsers');
    if (!existingData) return [];
    
    const usersData = JSON.parse(existingData);
    const globalOptions: FormOption[] = [];
    
    // Collect all custom options for this step from all users
    Object.values(usersData).forEach((userData: any) => {
      if (userData.customOptions && userData.customOptions[stepName]) {
        userData.customOptions[stepName].forEach((option: FormOption) => {
          // Only add if not already in the list
          if (!globalOptions.find(opt => opt.id === option.id)) {
            globalOptions.push(option);
          }
        });
      }
    });
    
    return globalOptions;
  } catch (error) {
    console.error('Error retrieving global custom options:', error);
    return [];
  }
}

export function saveCustomOption(userName: string, stepName: string, option: FormOption): void {
  try {
    const existingData = localStorage.getItem('corsicaTripUsers');
    const usersData = existingData ? JSON.parse(existingData) : {};
    
    if (!usersData[userName]) {
      usersData[userName] = {
        meals: [],
        allergies: [],
        breakfast: [],
        drinks: [],
        activities: [],
        budget: "",
        items: [],
        customOptions: {}
      };
    }
    
    if (!usersData[userName].customOptions) {
      usersData[userName].customOptions = {};
    }
    
    if (!usersData[userName].customOptions[stepName]) {
      usersData[userName].customOptions[stepName] = [];
    }
    
    usersData[userName].customOptions[stepName].push(option);
    localStorage.setItem('corsicaTripUsers', JSON.stringify(usersData));
  } catch (error) {
    console.error('Error saving custom option:', error);
  }
}

export function exportAllData(): string {
  try {
    const existingData = localStorage.getItem('corsicaTripUsers');
    return existingData || '{}';
  } catch (error) {
    console.error('Error exporting data:', error);
    return '{}';
  }
}

export function resetUserPreferences(userName: string): void {
  try {
    const existingData = localStorage.getItem('corsicaTripUsers');
    if (!existingData) return;
    
    const usersData = JSON.parse(existingData);
    if (usersData[userName]) {
      delete usersData[userName];
      localStorage.setItem('corsicaTripUsers', JSON.stringify(usersData));
    }
  } catch (error) {
    console.error('Error resetting user preferences:', error);
  }
}

export function getRemainingTime(): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const tripDate = new Date("2025-06-21T12:00:00");
  
  const diff = Math.max(0, tripDate.getTime() - now.getTime());
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}

export function formatCountdown(time: { days: number; hours: number; minutes: number; seconds: number }): string {
  return `J-${time.days} ${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
}

export function saveQuestionConfiguration(questions: any[]): void {
  try {
    localStorage.setItem('corsicaTripQuestions', JSON.stringify(questions));
  } catch (error) {
    console.error('Error saving question configuration:', error);
  }
}

export function getQuestionConfiguration(): any[] {
  try {
    const saved = localStorage.getItem('corsicaTripQuestions');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Configuration par défaut
    return [
      { stepName: 'meals', title: 'Plats préférés', emoji: '🍽️', allowMultiple: true, allowCustom: true, options: [] },
      { stepName: 'allergies', title: 'Allergies', emoji: '🚫', allowMultiple: true, allowCustom: true, options: [] },
      { stepName: 'breakfast', title: 'Petit-déjeuner', emoji: '🥐', allowMultiple: true, allowCustom: false, options: [] },
      { stepName: 'drinks', title: 'Boissons préférées', emoji: '🍷', allowMultiple: true, allowCustom: true, options: [] },
      { stepName: 'activities', title: 'Activités', emoji: '🏖️', allowMultiple: true, allowCustom: true, options: [] },
      { stepName: 'budget', title: 'Budget', emoji: '💰', allowMultiple: false, allowCustom: false, options: [] },
      { stepName: 'items', title: 'Objets à prévoir', emoji: '🧴', allowMultiple: true, allowCustom: true, options: [] }
    ];
  } catch (error) {
    console.error('Error loading question configuration:', error);
    return [];
  }
}
