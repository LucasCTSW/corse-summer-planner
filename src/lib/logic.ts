
import { UserPreferences, FormOption, StepName } from "./types";

// Options par défaut pour chaque question
const defaultOptions: { [key: string]: FormOption[] } = {
  meals: [
    { id: 'pizza', label: 'Pizza', emoji: '🍕' },
    { id: 'pasta', label: 'Pâtes', emoji: '🍝' },
    { id: 'bbq', label: 'Barbecue', emoji: '🔥' },
    { id: 'seafood', label: 'Fruits de mer', emoji: '🦐' },
    { id: 'salad', label: 'Salade', emoji: '🥗' },
    { id: 'raclette', label: 'Raclette', emoji: '🧀' }
  ],
  allergies: [
    { id: 'none', label: 'Aucune', emoji: '✅' },
    { id: 'nuts', label: 'Fruits à coque', emoji: '🥜' },
    { id: 'shellfish', label: 'Fruits de mer', emoji: '🦐' },
    { id: 'dairy', label: 'Produits laitiers', emoji: '🥛' },
    { id: 'gluten', label: 'Gluten', emoji: '🌾' }
  ],
  breakfast: [
    { id: 'coffee', label: 'Café', emoji: '☕' },
    { id: 'tea', label: 'Thé', emoji: '🍵' },
    { id: 'croissant', label: 'Viennoiseries', emoji: '🥐' },
    { id: 'juice', label: 'Jus de fruits', emoji: '🧃' }
  ],
  drinks: [
    { id: 'water', label: 'Eau', emoji: '💧' },
    { id: 'beer', label: 'Bière', emoji: '🍺' },
    { id: 'wine', label: 'Vin', emoji: '🍷' },
    { id: 'cocktail', label: 'Cocktails', emoji: '🍹' },
    { id: 'soda', label: 'Sodas', emoji: '🥤' }
  ],
  activities: [
    { id: 'beach', label: 'Plage', emoji: '🏖️' },
    { id: 'boat', label: 'Bateau', emoji: '⛵' },
    { id: 'hiking', label: 'Randonnée', emoji: '🥾' },
    { id: 'chill', label: 'Détente', emoji: '😎' },
    { id: 'snorkeling', label: 'Snorkeling', emoji: '🤿' },
    { id: 'sightseeing', label: 'Visites', emoji: '📸' }
  ],
  budget: [
    { id: 'tight', label: 'Serré (50-100€)', emoji: '💸' },
    { id: 'moderate', label: 'Modéré (100-200€)', emoji: '💰' },
    { id: 'splurge', label: 'Large (200€+)', emoji: '🤑' }
  ],
  items: [
    { id: 'sunscreen', label: 'Crème solaire', emoji: '🧴' },
    { id: 'camera', label: 'Appareil photo', emoji: '📷' },
    { id: 'snorkel', label: 'Masque et tuba', emoji: '🤿' },
    { id: 'towel', label: 'Serviette', emoji: '🏖️' }
  ]
};

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

// Fonction pour récupérer le libellé d'une option
export function getOptionLabel(stepName: StepName, optionId: string): string {
  console.log('Getting option label for:', { stepName, optionId });
  
  // 1. Chercher dans les options par défaut
  const defaultStepOptions = defaultOptions[stepName] || [];
  const defaultOption = defaultStepOptions.find(opt => opt.id === optionId);
  if (defaultOption) {
    console.log('Found in default options:', defaultOption.label);
    return defaultOption.label;
  }
  
  // 2. Chercher dans les options admin
  const questions = getQuestionConfiguration();
  const question = questions.find(q => q.stepName === stepName);
  if (question && question.options) {
    const adminOption = question.options.find((opt: FormOption) => opt.id === optionId);
    if (adminOption) {
      console.log('Found in admin options:', adminOption.label);
      return adminOption.label;
    }
  }
  
  // 3. Chercher dans toutes les options personnalisées des utilisateurs
  const existingData = localStorage.getItem('corsicaTripUsers');
  if (existingData) {
    const usersData = JSON.parse(existingData);
    
    for (const [userName, userData] of Object.entries(usersData)) {
      const userDataTyped = userData as any;
      if (userDataTyped.customOptions && userDataTyped.customOptions[stepName]) {
        const customOption = userDataTyped.customOptions[stepName].find(
          (opt: FormOption) => opt.id === optionId
        );
        if (customOption) {
          console.log('Found in user custom options:', customOption.label, 'by', userName);
          return customOption.label;
        }
      }
    }
  }
  
  // Fallback: retourner l'ID si rien n'est trouvé
  console.log('Option not found, returning ID:', optionId);
  return optionId;
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
    
    // Supprimer des options admin
    const questions = getQuestionConfiguration();
    const updatedQuestions = questions.map(q => {
      if (q.stepName === questionStepName) {
        const filteredOptions = (q.options || []).filter((opt: FormOption) => opt.id !== optionId);
        console.log('Filtered admin options:', filteredOptions);
        return {
          ...q,
          options: filteredOptions
        };
      }
      return q;
    });
    saveQuestionConfiguration(updatedQuestions);

    // Supprimer des préférences utilisateurs et options personnalisées
    const existingData = localStorage.getItem('corsicaTripUsers');
    if (existingData) {
      const usersData = JSON.parse(existingData);
      
      Object.keys(usersData).forEach(userName => {
        const userData = usersData[userName];
        
        // Supprimer des sélections utilisateur
        if (userData[questionStepName]) {
          if (Array.isArray(userData[questionStepName])) {
            userData[questionStepName] = userData[questionStepName].filter((id: string) => id !== optionId);
          } else if (userData[questionStepName] === optionId) {
            userData[questionStepName] = '';
          }
        }
        
        // Supprimer des options personnalisées
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
          options: [...(q.options || []), option]
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

// Fonction pour récupérer toutes les options disponibles pour une question (par défaut + admin + utilisateurs)
export function getAllOptionsForStep(stepName: StepName): FormOption[] {
  console.log('Getting all options for step:', stepName);
  
  // Options par défaut
  const defaultStepOptions = defaultOptions[stepName] || [];
  console.log('Default options:', defaultStepOptions);
  
  // Options admin
  const questions = getQuestionConfiguration();
  const question = questions.find(q => q.stepName === stepName);
  const adminOptions = question?.options || [];
  console.log('Admin options:', adminOptions);
  
  // Options personnalisées des utilisateurs
  const userCustomOptions = getGlobalCustomOptions(stepName);
  console.log('User custom options:', userCustomOptions);
  
  // Combiner et dédupliquer
  const combined = [...defaultStepOptions, ...adminOptions, ...userCustomOptions];
  const unique = combined.filter((option, index, self) => 
    index === self.findIndex(o => o.id === option.id)
  );
  
  console.log('All unique options for', stepName, ':', unique);
  return unique;
}

