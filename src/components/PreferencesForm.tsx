import { useState, useEffect } from 'react';
import { StepName, UserPreferences } from '@/lib/types';
import { saveUserPreferences, getUserPreferences, generatePersonalizedMessage } from '@/lib/logic';
import { defaultMeals, defaultAllergies, defaultBreakfast, defaultDrinks, defaultActivities, defaultItems, budgetOptions } from '@/lib/data';
import UserSelection from './UserSelection';
import FormStep from './FormStep';

interface PreferencesFormProps {
  onComplete: () => void;
}

const PreferencesForm = ({ onComplete }: PreferencesFormProps) => {
  const [currentStep, setCurrentStep] = useState<StepName>('user-selection');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    meals: [],
    allergies: [],
    breakfast: [],
    drinks: [],
    activities: [],
    budget: '',
    items: [],
  });
  const [completed, setCompleted] = useState(false);
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  useEffect(() => {
    if (selectedUser) {
      const savedPreferences = getUserPreferences(selectedUser);
      
      if (savedPreferences) {
        setPreferences(savedPreferences);
        if (savedPreferences.customMessage) {
          setPersonalizedMessage(savedPreferences.customMessage);
        }
      }
    }
  }, [selectedUser]);

  const handleUserSelect = (userName: string) => {
    setSelectedUser(userName);
    setCurrentStep('meals');
    setDirection('forward');
  };

  const handleNextStep = () => {
    setDirection('forward');
    switch (currentStep) {
      case 'meals':
        setCurrentStep('allergies');
        break;
      case 'allergies':
        setCurrentStep('breakfast');
        break;
      case 'breakfast':
        setCurrentStep('drinks');
        break;
      case 'drinks':
        setCurrentStep('activities');
        break;
      case 'activities':
        setCurrentStep('budget');
        break;
      case 'budget':
        setCurrentStep('items');
        break;
      case 'items':
        setCurrentStep('summary');
        const message = generatePersonalizedMessage(preferences);
        setPersonalizedMessage(message);
        break;
      case 'summary':
        if (selectedUser) {
          saveUserPreferences(selectedUser, {
            ...preferences,
            customMessage: personalizedMessage,
          });
        }
        setCompleted(true);
        onComplete();
        break;
      default:
        break;
    }
  };

  const handlePrevStep = () => {
    setDirection('backward');
    switch (currentStep) {
      case 'meals':
        setCurrentStep('user-selection');
        break;
      case 'allergies':
        setCurrentStep('meals');
        break;
      case 'breakfast':
        setCurrentStep('allergies');
        break;
      case 'drinks':
        setCurrentStep('breakfast');
        break;
      case 'activities':
        setCurrentStep('drinks');
        break;
      case 'budget':
        setCurrentStep('activities');
        break;
      case 'items':
        setCurrentStep('budget');
        break;
      case 'summary':
        setCurrentStep('items');
        break;
      default:
        break;
    }
  };

  const renderStep = () => {
    const animationClass = direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left';
    
    switch (currentStep) {
      case 'user-selection':
        return (
          <div className={animationClass}>
            <UserSelection 
              selectedUser={selectedUser} 
              onSelectUser={handleUserSelect} 
            />
          </div>
        );
        
      case 'meals':
        return (
          <div className={animationClass}>
            <FormStep
              title="Plats préférés"
              emoji="🍽️"
              options={defaultMeals}
              selectedValues={preferences.meals}
              onChange={(values) => setPreferences({ ...preferences, meals: values })}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              allowMultiple={true}
              allowCustom={true}
              isFirst={true}
              stepName="meals"
              currentUser={selectedUser || undefined}
            />
          </div>
        );
        
      case 'allergies':
        return (
          <div className={animationClass}>
            <FormStep
              title="Allergies"
              emoji="🚫"
              options={defaultAllergies}
              selectedValues={preferences.allergies}
              onChange={(values) => setPreferences({ ...preferences, allergies: values })}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              allowMultiple={true}
              allowCustom={true}
              stepName="allergies"
              currentUser={selectedUser || undefined}
            />
          </div>
        );
        
      case 'breakfast':
        return (
          <div className={animationClass}>
            <FormStep
              title="Petit-déjeuner"
              emoji="🥐"
              options={defaultBreakfast}
              selectedValues={preferences.breakfast}
              onChange={(values) => setPreferences({ ...preferences, breakfast: values })}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              allowMultiple={true}
              allowCustom={false}
              stepName="breakfast"
              currentUser={selectedUser || undefined}
            />
          </div>
        );
        
      case 'drinks':
        return (
          <div className={animationClass}>
            <FormStep
              title="Boissons préférées"
              emoji="🍷"
              options={defaultDrinks}
              selectedValues={preferences.drinks}
              onChange={(values) => setPreferences({ ...preferences, drinks: values })}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              allowMultiple={true}
              allowCustom={true}
              stepName="drinks"
              currentUser={selectedUser || undefined}
            />
          </div>
        );
        
      case 'activities':
        return (
          <div className={animationClass}>
            <FormStep
              title="Activités"
              emoji="🏖️"
              options={defaultActivities}
              selectedValues={preferences.activities}
              onChange={(values) => setPreferences({ ...preferences, activities: values })}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              allowMultiple={true}
              allowCustom={true}
              stepName="activities"
              currentUser={selectedUser || undefined}
            />
          </div>
        );
        
      case 'budget':
        return (
          <div className={animationClass}>
            <FormStep
              title="Budget"
              emoji="💰"
              options={budgetOptions}
              selectedValues={preferences.budget ? [preferences.budget] : []}
              onChange={(values) => setPreferences({ ...preferences, budget: values[0] || '' })}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              allowMultiple={false}
              allowCustom={false}
              stepName="budget"
              currentUser={selectedUser || undefined}
            />
          </div>
        );
        
      case 'items':
        return (
          <div className={animationClass}>
            <FormStep
              title="Objets à prévoir"
              emoji="🧴"
              options={defaultItems}
              selectedValues={preferences.items}
              onChange={(values) => setPreferences({ ...preferences, items: values })}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              allowMultiple={true}
              allowCustom={true}
              stepName="items"
              currentUser={selectedUser || undefined}
            />
          </div>
        );
        
      case 'summary':
        return (
          <div className={`form-step ${animationClass}`}>
            <h2 className="text-xl font-semibold mb-6 text-center">
              Résumé 🎉
            </h2>
            
            <div className="bg-corsica-sand/30 rounded-lg p-4 mb-6">
              <p className="text-lg font-medium mb-1">Message personnalisé:</p>
              <p className="text-xl">{personalizedMessage}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preferences.meals.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Plats préférés 🍽️:</p>
                  <ul className="list-disc list-inside">
                    {preferences.meals.map(meal => {
                      const mealOption = [...defaultMeals].find(m => m.id === meal);
                      return mealOption ? (
                        <li key={meal}>
                          {mealOption.emoji} {mealOption.label}
                        </li>
                      ) : <li key={meal}>{meal}</li>;
                    })}
                  </ul>
                </div>
              )}
              
              {preferences.allergies.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Allergies 🚫:</p>
                  <ul className="list-disc list-inside">
                    {preferences.allergies.map(allergy => {
                      const allergyOption = [...defaultAllergies].find(a => a.id === allergy);
                      return allergyOption ? (
                        <li key={allergy}>
                          {allergyOption.emoji} {allergyOption.label}
                        </li>
                      ) : <li key={allergy}>{allergy}</li>;
                    })}
                  </ul>
                </div>
              )}
              
              {preferences.breakfast.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Petit-déjeuner 🥐:</p>
                  <ul className="list-disc list-inside">
                    {preferences.breakfast.map(item => {
                      const breakfastOption = defaultBreakfast.find(b => b.id === item);
                      return breakfastOption ? (
                        <li key={item}>
                          {breakfastOption.emoji} {breakfastOption.label}
                        </li>
                      ) : <li key={item}>{item}</li>;
                    })}
                  </ul>
                </div>
              )}
              
              {preferences.drinks.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Boissons 🍷:</p>
                  <ul className="list-disc list-inside">
                    {preferences.drinks.map(drink => {
                      const drinkOption = [...defaultDrinks].find(d => d.id === drink);
                      return drinkOption ? (
                        <li key={drink}>
                          {drinkOption.emoji} {drinkOption.label}
                        </li>
                      ) : <li key={drink}>{drink}</li>;
                    })}
                  </ul>
                </div>
              )}
              
              {preferences.activities.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Activités 🏖️:</p>
                  <ul className="list-disc list-inside">
                    {preferences.activities.map(activity => {
                      const activityOption = [...defaultActivities].find(a => a.id === activity);
                      return activityOption ? (
                        <li key={activity}>
                          {activityOption.emoji} {activityOption.label}
                        </li>
                      ) : <li key={activity}>{activity}</li>;
                    })}
                  </ul>
                </div>
              )}
              
              {preferences.budget && (
                <div>
                  <p className="font-medium mb-1">Budget 💰:</p>
                  <p>
                    {budgetOptions.find(b => b.id === preferences.budget)?.emoji}{' '}
                    {budgetOptions.find(b => b.id === preferences.budget)?.label}
                  </p>
                </div>
              )}
              
              {preferences.items.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Objets à prévoir 🧴:</p>
                  <ul className="list-disc list-inside">
                    {preferences.items.map(item => {
                      const itemOption = [...defaultItems].find(i => i.id === item);
                      return itemOption ? (
                        <li key={item}>
                          {itemOption.emoji} {itemOption.label}
                        </li>
                      ) : <li key={item}>{item}</li>;
                    })}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-8">
              <div 
                className="cursor-pointer text-corsica-blue hover:underline"
                onClick={handlePrevStep}
              >
                ← Revenir en arrière
              </div>
              <div 
                className="cursor-pointer text-corsica-blue hover:underline"
                onClick={handleNextStep}
              >
                Valider ✓
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto overflow-hidden px-4">
      {renderStep()}
    </div>
  );
};

export default PreferencesForm;
