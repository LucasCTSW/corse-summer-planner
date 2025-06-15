
import { useState, useEffect } from 'react';
import { StepName, UserPreferences } from '@/lib/types';
import { saveUserPreferences, getUserPreferences, generatePersonalizedMessage, getQuestionConfiguration } from '@/lib/logic';
import { defaultMeals, defaultAllergies, defaultBreakfast, defaultDrinks, defaultActivities, defaultItems, budgetOptions } from '@/lib/data';
import UserSelection from './UserSelection';
import FormStep from './FormStep';

interface PreferencesFormProps {
  onComplete: (userData: any) => void;
}

interface QuestionConfig {
  stepName: StepName;
  title: string;
  emoji: string;
  allowMultiple: boolean;
  allowCustom: boolean;
  order: number;
  options: any[];
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
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [questionConfigs, setQuestionConfigs] = useState<QuestionConfig[]>([]);
  const [allSteps, setAllSteps] = useState<StepName[]>(['user-selection']);

  useEffect(() => {
    // Charger la configuration des questions
    const configs = getQuestionConfiguration();
    const sortedConfigs = configs.sort((a, b) => (a.order || 0) - (b.order || 0));
    setQuestionConfigs(sortedConfigs);
    
    // Créer la liste des étapes
    const steps: StepName[] = ['user-selection', ...sortedConfigs.map(c => c.stepName), 'summary'];
    setAllSteps(steps);
    
    console.log('Questions chargées:', sortedConfigs);
    console.log('Étapes créées:', steps);
  }, []);

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

  const getCurrentStepIndex = () => {
    return allSteps.indexOf(currentStep);
  };

  const getNextStep = (): StepName | null => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < allSteps.length - 1) {
      return allSteps[currentIndex + 1];
    }
    return null;
  };

  const getPrevStep = (): StepName | null => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      return allSteps[currentIndex - 1];
    }
    return null;
  };

  const handleUserSelect = (userName: string) => {
    setSelectedUser(userName);
    if (allSteps.length > 1) {
      setCurrentStep(allSteps[1]); // Première question après user-selection
    }
    setDirection('forward');
  };

  const handleNextStep = () => {
    setDirection('forward');
    
    if (currentStep === 'summary') {
      if (selectedUser) {
        const userData = {
          ...preferences,
          customMessage: personalizedMessage,
        };
        saveUserPreferences(selectedUser, userData);
        onComplete(userData);
      }
      return;
    }

    const nextStep = getNextStep();
    if (nextStep) {
      if (nextStep === 'summary') {
        const message = generatePersonalizedMessage(preferences);
        setPersonalizedMessage(message);
      }
      setCurrentStep(nextStep);
    }
  };

  const handlePrevStep = () => {
    setDirection('backward');
    const prevStep = getPrevStep();
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  const getDefaultOptionsForStep = (stepName: StepName) => {
    switch (stepName) {
      case 'meals': return defaultMeals;
      case 'allergies': return defaultAllergies;
      case 'breakfast': return defaultBreakfast;
      case 'drinks': return defaultDrinks;
      case 'activities': return defaultActivities;
      case 'budget': return budgetOptions;
      case 'items': return defaultItems;
      default: return [];
    }
  };

  const getCurrentQuestionConfig = () => {
    return questionConfigs.find(q => q.stepName === currentStep);
  };

  const renderStep = () => {
    const animationClass = direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left';
    
    if (currentStep === 'user-selection') {
      return (
        <div className={animationClass}>
          <UserSelection 
            selectedUser={selectedUser} 
            onSelectUser={handleUserSelect} 
          />
        </div>
      );
    }

    if (currentStep === 'summary') {
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
            {questionConfigs.map(config => {
              const stepPreferences = preferences[config.stepName as keyof UserPreferences];
              const hasData = Array.isArray(stepPreferences) ? stepPreferences.length > 0 : stepPreferences;
              
              if (!hasData) return null;
              
              return (
                <div key={config.stepName}>
                  <p className="font-medium mb-1">{config.title} {config.emoji}:</p>
                  {Array.isArray(stepPreferences) ? (
                    <ul className="list-disc list-inside">
                      {stepPreferences.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{stepPreferences}</p>
                  )}
                </div>
              );
            })}
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
    }

    // Rendu des étapes de questions dynamiques
    const config = getCurrentQuestionConfig();
    if (!config) {
      console.error('Configuration non trouvée pour:', currentStep);
      return <div>Erreur: Configuration de question non trouvée</div>;
    }

    const defaultOptions = getDefaultOptionsForStep(currentStep);
    const stepPreferences = preferences[currentStep as keyof UserPreferences];
    const selectedValues = Array.isArray(stepPreferences) ? stepPreferences : (stepPreferences ? [stepPreferences] : []);

    return (
      <div className={animationClass}>
        <FormStep
          title={config.title}
          emoji={config.emoji}
          options={defaultOptions}
          selectedValues={selectedValues}
          onChange={(values) => {
            if (config.allowMultiple) {
              setPreferences({ ...preferences, [currentStep]: values });
            } else {
              setPreferences({ ...preferences, [currentStep]: values[0] || '' });
            }
          }}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          allowMultiple={config.allowMultiple}
          allowCustom={config.allowCustom}
          isFirst={getCurrentStepIndex() <= 1}
          isLast={getNextStep() === 'summary'}
          stepName={currentStep}
          currentUser={selectedUser || undefined}
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto overflow-hidden px-4">
      {renderStep()}
    </div>
  );
};

export default PreferencesForm;
