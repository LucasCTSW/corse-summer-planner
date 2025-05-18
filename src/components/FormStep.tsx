
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormOption } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
}: FormStepProps) => {
  const [customOption, setCustomOption] = useState('');
  const [customOptions, setCustomOptions] = useState<FormOption[]>([]);

  const handleSelect = (id: string) => {
    if (allowMultiple) {
      const isSelected = selectedValues.includes(id);
      
      if (isSelected) {
        onChange(selectedValues.filter(v => v !== id));
      } else {
        onChange([...selectedValues, id]);
      }
    } else {
      onChange([id]); // Single selection mode
    }
  };

  const addCustomOption = () => {
    if (customOption.trim() === '') return;
    
    const newOption = {
      id: `custom-${Date.now()}`,
      label: customOption,
      emoji: '✨'
    };
    
    setCustomOptions([...customOptions, newOption]);
    onChange([...selectedValues, newOption.id]);
    setCustomOption('');
  };

  return (
    <div className="form-step">
      <h2 className="text-xl font-semibold mb-6 text-center">
        {title} <span aria-hidden="true">{emoji}</span>
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[...options, ...customOptions].map(option => (
          <div
            key={option.id}
            className={cn(
              "border rounded-lg p-3 flex items-center cursor-pointer transition-all",
              selectedValues.includes(option.id) 
                ? "border-primary bg-primary/10" 
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => handleSelect(option.id)}
          >
            {option.emoji && (
              <span className="text-xl mr-2" aria-hidden="true">
                {option.emoji}
              </span>
            )}
            <span>{option.label}</span>
          </div>
        ))}
      </div>
      
      {allowCustom && (
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
