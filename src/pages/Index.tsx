
import { useState } from 'react';
import Header from '@/components/Header';
import PreferencesForm from '@/components/PreferencesForm';
import { Button } from '@/components/ui/button';
import { exportAllData, resetUserPreferences } from '@/lib/logic';

const Index = () => {
  const [formCompleted, setFormCompleted] = useState(false);
  const [completedUserData, setCompletedUserData] = useState<any>(null);
  
  const handleFormComplete = (userData: any) => {
    setFormCompleted(true);
    setCompletedUserData(userData);
  };
  
  const handleStartOver = () => {
    setFormCompleted(false);
    setCompletedUserData(null);
  };

  const getActivityStats = () => {
    if (!completedUserData) return null;
    
    const stats = {
      totalChoices: 0,
      categories: {
        meals: completedUserData.meals?.length || 0,
        drinks: completedUserData.drinks?.length || 0,
        activities: completedUserData.activities?.length || 0,
        items: completedUserData.items?.length || 0,
      }
    };
    
    stats.totalChoices = Object.values(stats.categories).reduce((a, b) => a + b, 0);
    return stats;
  };

  const stats = getActivityStats();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 mx-auto">
          {!formCompleted ? (
            <div className="mb-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Préférences pour le voyage 🏝️</h2>
                <p className="text-muted-foreground">Aide-nous à organiser le séjour idéal en Corse !</p>
              </div>
              
              <PreferencesForm onComplete={handleFormComplete} />
            </div>
          ) : (
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <div className="bg-corsica-sand/30 rounded-lg p-8 mb-6">
                <h2 className="text-2xl font-bold mb-4">🎉 Merci pour tes réponses !</h2>
                
                <div className="text-lg mb-6">
                  {completedUserData?.customMessage}
                </div>
                
                {stats && (
                  <div className="bg-white/50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-3">📊 Tes stats</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total choix :</span> {stats.totalChoices}
                      </div>
                      <div>
                        <span className="font-medium">🍽️ Plats :</span> {stats.categories.meals}
                      </div>
                      <div>
                        <span className="font-medium">🍷 Boissons :</span> {stats.categories.drinks}
                      </div>
                      <div>
                        <span className="font-medium">🏖️ Activités :</span> {stats.categories.activities}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={handleStartOver} variant="outline">
                  Recommencer
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t py-6 bg-muted/30">
        <div className="container px-4 mx-auto text-center text-sm text-muted-foreground">
          <p>Application planification voyage en Corse - Été 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
