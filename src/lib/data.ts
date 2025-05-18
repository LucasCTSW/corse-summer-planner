
import { AttendanceInfo, FormOption } from "./types";

export const attendanceData: AttendanceInfo[] = [
  {
    name: "Lucas",
    startDate: "21 juin 2025",
    endDate: "1 juillet 2025",
    transport: "Avion",
    transportIcon: "✈️"
  },
  {
    name: "Ghislain",
    startDate: "21 juin 2025",
    endDate: "1 juillet 2025",
    transport: "Avion",
    transportIcon: "✈️"
  },
  {
    name: "Jade",
    startDate: "21 juin 2025",
    endDate: "1 juillet 2025",
    transport: "Avion",
    transportIcon: "✈️"
  },
  {
    name: "Jacques",
    startDate: "21 juin 2025",
    endDate: "1 juillet 2025",
    transport: "Avion",
    transportIcon: "✈️"
  },
  {
    name: "Flaco",
    startDate: "21 juin 2025",
    endDate: "29 juin 2025",
    transport: "Avion",
    transportIcon: "✈️"
  },
  {
    name: "Camille",
    startDate: "23 juin 2025",
    endDate: "28 juin 2025",
    transport: "Voiture + ferry",
    transportIcon: "🚗🛳️"
  },
  {
    name: "Oscar",
    startDate: "23 juin 2025",
    endDate: "28 juin 2025",
    transport: "Voiture + ferry",
    transportIcon: "🚗🛳️"
  },
  {
    name: "Nicolas",
    startDate: "23 juin 2025",
    endDate: "1 juillet 2025",
    transport: "Aller voiture, retour avion",
    transportIcon: "🚗✈️"
  }
];

export const userNames = attendanceData.map(user => user.name);

export const defaultMeals: FormOption[] = [
  { id: "bbq", label: "Barbecue", emoji: "🔥" },
  { id: "pasta", label: "Pâtes", emoji: "🍝" },
  { id: "salad", label: "Salade", emoji: "🥗" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "raclette", label: "Raclette", emoji: "🧀" },
  { id: "seafood", label: "Fruits de mer", emoji: "🦐" },
];

export const defaultAllergies: FormOption[] = [
  { id: "gluten", label: "Gluten", emoji: "🌾" },
  { id: "lactose", label: "Lactose", emoji: "🥛" },
  { id: "nuts", label: "Fruits à coque", emoji: "🥜" },
  { id: "seafood", label: "Fruits de mer", emoji: "🦞" },
  { id: "none", label: "Aucune allergie", emoji: "✅" },
];

export const defaultBreakfast: FormOption[] = [
  { id: "croissant", label: "Croissant", emoji: "🥐" },
  { id: "cereal", label: "Céréales", emoji: "🥣" },
  { id: "fruit", label: "Fruits", emoji: "🍎" },
  { id: "yogurt", label: "Yaourt", emoji: "🥛" },
  { id: "bread", label: "Pain/Tartines", emoji: "🍞" },
  { id: "coffee", label: "Café", emoji: "☕" },
  { id: "tea", label: "Thé", emoji: "🍵" },
  { id: "juice", label: "Jus", emoji: "🧃" },
];

export const defaultDrinks: FormOption[] = [
  { id: "water", label: "Eau", emoji: "💧" },
  { id: "soda", label: "Soda", emoji: "🥤" },
  { id: "juice", label: "Jus", emoji: "🧃" },
  { id: "beer", label: "Bière", emoji: "🍺" },
  { id: "wine", label: "Vin", emoji: "🍷" },
  { id: "rose", label: "Rosé", emoji: "🥂" },
  { id: "cocktail", label: "Cocktails", emoji: "🍹" },
  { id: "jagermeister", label: "Jägermeister", emoji: "🥃" },
];

export const defaultActivities: FormOption[] = [
  { id: "beach", label: "Plage", emoji: "🏖️" },
  { id: "hike", label: "Randonnée", emoji: "🥾" },
  { id: "boat", label: "Bateau", emoji: "🚤" },
  { id: "chill", label: "Chill", emoji: "😎" },
  { id: "sightseeing", label: "Visites", emoji: "🏛️" },
  { id: "snorkeling", label: "Snorkeling", emoji: "🤿" },
];

export const defaultItems: FormOption[] = [
  { id: "sunscreen", label: "Crème solaire", emoji: "🧴" },
  { id: "hat", label: "Chapeau", emoji: "👒" },
  { id: "swimsuit", label: "Maillot de bain", emoji: "👙" },
  { id: "towel", label: "Serviette", emoji: "🧖" },
  { id: "sunglasses", label: "Lunettes de soleil", emoji: "🕶️" },
  { id: "camera", label: "Appareil photo", emoji: "📷" },
];

export const budgetOptions: FormOption[] = [
  { id: "tight", label: "Serré", emoji: "💸" },
  { id: "moderate", label: "Modéré", emoji: "💰" },
  { id: "splurge", label: "On se fait plaisir", emoji: "💎" },
];

export const TRIP_DATE = new Date("2025-06-21T12:00:00");

export const defaultUserPreferences = {
  meals: [],
  allergies: [],
  breakfast: [],
  drinks: [],
  activities: [],
  budget: "",
  items: [],
};
