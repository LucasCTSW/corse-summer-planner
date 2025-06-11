
import { userNames } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getUserPreferences } from '@/lib/logic';
import { CheckCircle, Clock, Circle } from 'lucide-react';

interface UserSelectionProps {
  selectedUser: string | null;
  onSelectUser: (user: string) => void;
}

const UserSelection = ({ selectedUser, onSelectUser }: UserSelectionProps) => {
  const getUserStatus = (userName: string) => {
    const prefs = getUserPreferences(userName);
    if (!prefs) return 'not-started';
    
    const hasBasicData = prefs.meals || prefs.drinks || prefs.activities || prefs.budget;
    if (!hasBasicData) return 'not-started';
    
    const requiredFields = ['meals', 'drinks', 'activities', 'budget'];
    const completedFields = requiredFields.filter(field => prefs[field] && prefs[field].length > 0);
    
    if (completedFields.length === requiredFields.length && prefs.customMessage) {
      return 'completed';
    } else {
      return 'in-progress';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      default:
        return 'Nouveau';
    }
  };

  return (
    <div className="form-step">
      <h2 className="text-xl font-semibold mb-6 text-center">Qui es-tu ? 👋</h2>
      
      <div className="user-selection">
        {userNames.map(name => {
          const status = getUserStatus(name);
          return (
            <div 
              key={name}
              className={cn(
                "user-option relative",
                selectedUser === name && "active"
              )}
              onClick={() => onSelectUser(name)}
            >
              <div className="absolute top-2 right-2">
                {getStatusIcon(status)}
              </div>
              <div className="w-12 h-12 rounded-full bg-corsica-light-blue/20 flex items-center justify-center text-xl mb-2">
                {name[0]}
              </div>
              <span className="font-medium">{name}</span>
              <div className="text-xs text-muted-foreground mt-1">
                {getStatusText(status)}
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedUser && (
        <div className="mt-8 text-center">
          <Button 
            className="bg-corsica-blue hover:bg-corsica-blue/90 text-white"
            onClick={() => onSelectUser(selectedUser)}
          >
            {getUserStatus(selectedUser) === 'completed' ? 'Voir mes réponses' : 'Continuer'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserSelection;
