import { UserPreferences, FormOption, StepName } from "./types";

// Phrases génériques
const genericMessages = [
  "Merci pour tes réponses, camarade de fun ! On se retrouve sur la plage 🌴😎",
  "Au top, t'es prêt pour les vacances loulou ! 🏖️🤟",
  "Ok pelo, rendez-vous dans quelques jours pour le décollage 🚀",
  "C'est validé ! Prépare la crème solaire et la playlist, ça va envoyer 🔥",
  "Merci chef, y'a plus qu'à tout réserver. On compte sur toi pour l'ambiance ! 🍹",
  "Bravo, tu viens d'obtenir le badge \"vacancier officiel\" 🥇😜",
  "Let's go ! Avec toi dans l'équipe, c'est sûr qu'on va pas s'ennuyer 😏",
  "Trop bien, les vacances approchent, plus qu'à attendre le top départ ! ⏰🌅",
  "Good job, maintenant on laisse le destin (et le groupe WhatsApp) faire le reste 📲😅",
  "Formulaire plié, t'as géré comme un chef. La suite au prochain épisode ! 🍿"
];

export function generatePersonalizedMessage(preferences: UserPreferences): string {
  const { meals, drinks, activities, budget, allergies } = preferences;
  
  // Vérifications pour phrases personnalisées
  if (budget === "splurge" && meals.includes("raclette")) {
    return "Ça marche Jeff Bezos 🤑";
  }
  
  if (budget === "tight" && !activities.includes("chill")) {
    return "Bonnes vacances Mamie 👵";
  }
  
  if (activities.includes("chill") && meals.includes("bbq") && drinks.includes("beer")) {
    return "Des vacances à la cool 🍻";
  }
  
  if (meals.length >= 5 && drinks.length >= 5 && activities.length >= 5) {
    return "Tu veux pas qu'on partir avec un traiteur aussi ? 😅";
  }
  
  if (meals.length === 0 && drinks.length === 0 && activities.length === 0 && !budget) {
    return "T'as coché quoi en fait ? 😂";
  }
  
  if (budget === "splurge" && meals.includes("bbq") && drinks.includes("beer")) {
    return "On prévoit un food truck et un bar à cocktails aussi ? 🍔🍹";
  }
  
  if (budget === "tight" && meals.includes("raclette") && allergies.length >= 3) {
    return "Raclette sans fromage, pain, ni charcut'… ça va finir en soirée salade verte ! 🥗😂";
  }
  
  if (activities.includes("chill") && activities.length === 1) {
    return "On te réserve un transat ou une chambre au spa ? 🧘‍♂️😴";
  }
  
  if (allergies.length >= 4) {
    return "Préviens le SAMU, on sait jamais… 🚑😂";
  }
  
  if (activities.includes("chill") && meals.length <= 1 && activities.length <= 2) {
    return "Programme : sieste, apéro, et re-sieste. T'es là pour le concours du plus gros dormeur ? 😴🍹";
  }
  
  if (activities.includes("boat") && budget === "tight") {
    return "On va pagayer ou c'est pédalo collectif ? 🛶";
  }
  
  // Phrases génériques
  const genericMessages = [
    "Merci pour tes réponses, camarade de fun ! On se retrouve sur la plage 🌴😎",
    "Au top, t'es prêt pour les vacances loulou ! 🏖️🤟",
    "Ok pelo, rendez-vous dans quelques jours pour le décollage 🚀",
    "C'est validé ! Prépare la crème solaire et la playlist, ça va envoyer 🔥",
    "Merci chef, y'a plus qu'à tout réserver. On compte sur toi pour l'ambiance ! 🍹",
    "Bravo, tu viens d'obtenir le badge \"vacancier officiel\" 🥇😜",
    "Let's go ! Avec toi dans l'équipe, c'est sûr qu'on va pas s'ennuyer 😏",
    "Trop bien, les vacances approchent, plus qu'à attendre le top départ ! ⏰🌅",
    "Good job, maintenant on laisse le destin (et le groupe WhatsApp) faire le reste 📲😅",
    "Formulaire plié, t'as géré comme un chef. La suite au prochain épisode ! 🍿"
  ];
  
  // Si aucune condition spéciale n'est remplie, retourner un message générique aléatoire
  const randomIndex = Math.floor(Math.random() * genericMessages.length);
  return genericMessages[randomIndex];
}

export function saveUserPreferences(userName: string, preferences: UserPreferences): void {
  try {
    console.log('Saving preferences for user:', userName, preferences);
    const existingData = localStorage.getItem('corsicaTripUsers');
    const usersData = existingData ? JSON.parse(existingData) : {};
    
    usersData[userName] = {
      ...preferences,
      customMessage: generatePersonalizedMessage(preferences)
    };
    
    localStorage.setItem('corsicaTripUsers', JSON.stringify(usersData));
    console.log('Preferences saved successfully');
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
    console.log('Getting global custom options for step:', stepName);
    const existingData = localStorage.getItem('corsicaTripUsers');
    if (!existingData) {
      console.log('No existing data found');
      return [];
    }
    
    const usersData = JSON.parse(existingData);
    const globalOptions: FormOption[] = [];
    
    Object.values(usersData).forEach((userData: any) => {
      if (userData.customOptions && userData.customOptions[stepName]) {
        userData.customOptions[stepName].forEach((option: FormOption) => {
          if (!globalOptions.find(opt => opt.id === option.id)) {
            globalOptions.push(option);
          }
        });
      }
    });
    
    console.log('Found global custom options:', globalOptions);
    return globalOptions;
  } catch (error) {
    console.error('Error retrieving global custom options:', error);
    return [];
  }
}

export function saveCustomOption(userName: string, stepName: string, option: FormOption): void {
  try {
    console.log('Saving custom option:', { userName, stepName, option });
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
    console.log('Custom option saved successfully');
  } catch (error) {
    console.error('Error saving custom option:', error);
  }
}

export function deleteOptionFromQuestion(questionStepName: string, optionId: string): void {
  try {
    console.log('Deleting option:', { questionStepName, optionId });
    
    // Remove from question configuration (admin-added options)
    const questions = getQuestionConfiguration();
    const updatedQuestions = questions.map(q => {
      if (q.stepName === questionStepName) {
        const filteredOptions = q.options.filter(opt => opt.id !== optionId);
        console.log('Filtered admin options:', filteredOptions);
        return {
          ...q,
          options: filteredOptions
        };
      }
      return q;
    });
    saveQuestionConfiguration(updatedQuestions);

    // Remove from all user preferences and custom options
    const existingData = localStorage.getItem('corsicaTripUsers');
    if (existingData) {
      const usersData = JSON.parse(existingData);
      
      Object.keys(usersData).forEach(userName => {
        const userData = usersData[userName];
        
        // Remove from user's selections
        if (userData[questionStepName] && Array.isArray(userData[questionStepName])) {
          userData[questionStepName] = userData[questionStepName].filter((id: string) => id !== optionId);
        }
        
        // Remove from user's custom options
        if (userData.customOptions && userData.customOptions[questionStepName]) {
          userData.customOptions[questionStepName] = userData.customOptions[questionStepName].filter(
            (opt: FormOption) => opt.id !== optionId
          );
        }
      });
      
      localStorage.setItem('corsicaTripUsers', JSON.stringify(usersData));
      console.log('Option deleted from all user data');
    }
  } catch (error) {
    console.error('Error deleting option from question:', error);
  }
}

export function addOptionToQuestion(questionStepName: string, option: FormOption): void {
  try {
    console.log('Adding option to question:', { questionStepName, option });
    const questions = getQuestionConfiguration();
    const updatedQuestions = questions.map(q => {
      if (q.stepName === questionStepName) {
        return {
          ...q,
          options: [...q.options, option]
        };
      }
      return q;
    });
    saveQuestionConfiguration(updatedQuestions);
    console.log('Option added to question configuration');
  } catch (error) {
    console.error('Error adding option to question:', error);
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
    console.log('Saving question configuration:', questions);
    localStorage.setItem('corsicaTripQuestions', JSON.stringify(questions));
  } catch (error) {
    console.error('Error saving question configuration:', error);
  }
}

export function getQuestionConfiguration(): any[] {
  try {
    const saved = localStorage.getItem('corsicaTripQuestions');
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('Loaded question configuration:', parsed);
      return parsed;
    }
    
    // Configuration par défaut
    const defaultConfig = [
      { stepName: 'meals', title: 'Plats préférés', emoji: '🍽️', allowMultiple: true, allowCustom: true, options: [] },
      { stepName: 'allergies', title: 'Allergies', emoji: '🚫', allowMultiple: true, allowCustom: true, options: [] },
      { stepName: 'breakfast', title: 'Petit-déjeuner', emoji: '🥐', allowMultiple: true, allowCustom: false, options: [] },
      { stepName: 'drinks', title: 'Boissons préférées', emoji: '🍷', allowMultiple: true, allowCustom: true, options: [] },
      { stepName: 'activities', title: 'Activités', emoji: '🏖️', allowMultiple: true, allowCustom: true, options: [] },
      { stepName: 'budget', title: 'Budget', emoji: '💰', allowMultiple: false, allowCustom: false, options: [] },
      { stepName: 'items', title: 'Objets à prévoir', emoji: '🧴', allowMultiple: true, allowCustom: true, options: [] }
    ];
    console.log('Using default configuration:', defaultConfig);
    return defaultConfig;
  } catch (error) {
    console.error('Error loading question configuration:', error);
    return [];
  }
}
