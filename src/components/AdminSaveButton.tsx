
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Check, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AdminSaveButtonProps {
  onSave: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const AdminSaveButton = ({ 
  onSave, 
  disabled = false, 
  variant = 'default',
  size = 'default',
  className = ''
}: AdminSaveButtonProps) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulation d'une sauvegarde
      onSave();
      setSaved(true);
      
      toast({
        title: "✅ Sauvegardé avec succès",
        description: "Les modifications ont été enregistrées.",
        duration: 3000,
      });
      
      // Réinitialiser l'état après 2 secondes
      setTimeout(() => {
        setSaved(false);
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "❌ Erreur de sauvegarde",
        description: "Impossible d'enregistrer les modifications. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={disabled || saving}
      variant={variant}
      size={size}
      className={className}
    >
      {saving ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Enregistrement...
        </>
      ) : saved ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Sauvegardé !
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </>
      )}
    </Button>
  );
};

export default AdminSaveButton;
