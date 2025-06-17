
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormOption, StepName } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getGlobalCustomOptions, saveCustomOption, getQuestionConfiguration, getAllOptionsForStep } from '@/lib/logic';

interface FormStepProps {
  title: string;
  emoji: string;
  options: FormOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  allowMultiple?: boolean;
  allowCustom?: boolean;
  isLast?: boolean;
  isFirst?: boolean;
  stepName: StepName;
  currentUser?: string;
}

const FormStep = ({
  title,
  emoji,
  options,
  selectedValues,
  onChange,
  onNext,
  onPrev,
  allowMultiple = true,
  allowCustom = false,
  isLast = false,
  isFirst = false,
  stepName,
  currentUser,
}: FormStepProps) => {
  const [customOption, setCustomOption] = useState('');
  const [allAvailableOptions, setAllAvailableOptions] = useState<FormOption[]>([]);

  useEffect(() => {
    const loadAllOptions = () => {
      console.log('Loading options for step:', stepName);
      
      // Utiliser la nouvelle fonction pour récupérer toutes les options
      const allOptions = getAllOptionsForStep(stepName);
      console.log('All options loaded:', allOptions);
      
      setAllAvailableOptions(allOptions);
    };

    loadAllOptions();
    
    // Refresh options every 3 seconds to catch admin changes and new user options
    const interval = setInterval(loadAllOptions, 3000);
    
    return () => clearInterval(interval);
  }, [stepName, options]);

  const handleSelect = (id: string) => {
    if (allowMultiple) {
      const isSelected = selectedValues.includes(id);
      
      if (isSelected) {
        onChange(selectedValues.filter(v => v !== id));
      } else {
        onChange([...selectedValues, id]);
      }
    } else {
      onChange([id]);
    }
  };

  const addCustomOption = () => {
    if (customOption.trim() === '' || !currentUser) return;
    
    const newOption: FormOption = {
      id: `custom-${stepName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: customOption.trim(),
      emoji: '✨',
      addedBy: currentUser
    };
    
    console.log('Adding new custom option:', newOption);
    
    // Save the custom option globally
    saveCustomOption(currentUser, stepName, newOption);
    
    // Update local state immediately
    setAllAvailableOptions(prev => [...prev, newOption]);
    
    // Select the new option
    onChange([...selectedValues, newOption.id]);
    setCustomOption('');
  };

  return (
    <div className="form-step">
      <h2 className="text-xl font-semibold mb-6 text-center">
        {title} <span aria-hidden="true">{emoji}</span>
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allAvailableOptions.map(option => (
          <div
            key={option.id}
            className={cn(
              "border rounded-lg p-3 flex flex-col cursor-pointer transition-all",
              selectedValues.includes(option.id) 
                ? "border-primary bg-primary/10" 
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => handleSelect(option.id)}
          >
            <div className="flex items-center">
              {option.emoji && (
                <span className="text-xl mr-2" aria-hidden="true">
                  {option.emoji}
                </span>
              )}
              <span className="flex-1">{option.label}</span>
            </div>
            {option.addedBy && (
              <div className="text-xs text-muted-foreground mt-1">
                ajouté par {option.addedBy}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {allowCustom && currentUser && (
        <div className="mt-4 flex items-center gap-2">
          <Input 
            value={customOption}
            onChange={e => setCustomOption(e.target.value)}
            placeholder="Ajouter une option..."
            className="flex-1"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomOption();
              }
            }}
          />
          <Button 
            onClick={addCustomOption}
            variant="outline"
          >
            Ajouter
          </Button>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isFirst}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
        </Button>
        
        <Button 
          className="bg-corsica-blue hover:bg-corsica-blue/90 text-white"
          onClick={onNext}
        >
          {isLast ? 'Terminer' : 'Suivant'} <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default FormStep;

