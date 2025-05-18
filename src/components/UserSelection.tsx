
import { userNames } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserSelectionProps {
  selectedUser: string | null;
  onSelectUser: (user: string) => void;
}

const UserSelection = ({ selectedUser, onSelectUser }: UserSelectionProps) => {
  return (
    <div className="form-step">
      <h2 className="text-xl font-semibold mb-6 text-center">Qui es-tu ? 👋</h2>
      
      <div className="user-selection">
        {userNames.map(name => (
          <div 
            key={name}
            className={cn(
              "user-option",
              selectedUser === name && "active"
            )}
            onClick={() => onSelectUser(name)}
          >
            <div className="w-12 h-12 rounded-full bg-corsica-light-blue/20 flex items-center justify-center text-xl mb-2">
              {name[0]}
            </div>
            <span className="font-medium">{name}</span>
          </div>
        ))}
      </div>
      
      {selectedUser && (
        <div className="mt-8 text-center">
          <Button 
            className="bg-corsica-blue hover:bg-corsica-blue/90 text-white"
            onClick={() => onSelectUser(selectedUser)}
          >
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserSelection;
