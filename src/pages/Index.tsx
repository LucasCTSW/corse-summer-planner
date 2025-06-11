import { useState } from 'react';
import Header from '@/components/Header';
import PreferencesForm from '@/components/PreferencesForm';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import { Button } from '@/components/ui/button';
import { exportAllData, resetUserPreferences } from '@/lib/logic';

const Index = () => {
  const [formCompleted, setFormCompleted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [exportedData, setExportedData] = useState('');
  const [resetUser, setResetUser] = useState('');
  
  const handleFormComplete = () => {
    setFormCompleted(true);
    setShowCalendar(true);
  };
  
  const handleStartOver = () => {
    setFormCompleted(false);
    setShowCalendar(false);
    setShowAdmin(false);
    setIsAuthenticated(false);
    setExportedData('');
  };

  const handleAdminAuth = () => {
    // Simple admin auth (password: "admin")
    if (adminPassword === 'admin') {
      setIsAuthenticated(true);
      setExportedData(exportAllData());
    }
  };

  const handleResetUser = () => {
    if (resetUser) {
      resetUserPreferences(resetUser);
      setResetUser('');
      setExportedData(exportAllData());
    }
  };

  const downloadData = () => {
    const blob = new Blob([exportedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corsica_trip_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
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
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/management', '_blank')}
                  >
                    🛠️ Interface de gestion
                  </Button>
                </div>
              </div>
              
              <PreferencesForm onComplete={handleFormComplete} />
            </div>
          ) : (
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold mb-2">Merci pour tes choix !</h2>
              <p className="text-muted-foreground mb-6">Tes préférences ont été enregistrées.</p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={handleStartOver} variant="outline">
                  Recommencer
                </Button>
                
                <Button 
                  onClick={() => setShowCalendar(!showCalendar)}
                  variant={showCalendar ? "default" : "outline"}
                >
                  {showCalendar ? 'Masquer le calendrier' : 'Voir le calendrier'}
                </Button>
                
                <Button 
                  onClick={() => window.open('/management', '_blank')}
                  variant="outline"
                >
                  Interface de gestion
                </Button>
                
                <Button 
                  onClick={() => setShowAdmin(!showAdmin)}
                  variant={showAdmin ? "default" : "outline"}
                >
                  {showAdmin ? 'Masquer' : 'Admin'}
                </Button>
              </div>
            </div>
          )}
          
          {showCalendar && (
            <div className="mb-10">
              <AttendanceCalendar />
            </div>
          )}
          
          {showAdmin && (
            <div className="mb-10 max-w-2xl mx-auto">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold mb-4">Interface Admin</h3>
                
                {!isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="password" 
                      placeholder="Mot de passe" 
                      className="border rounded-md px-3 py-2 flex-1"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAdminAuth();
                        }
                      }}
                    />
                    <Button onClick={handleAdminAuth}>
                      Accéder
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium mb-2">Réinitialiser un utilisateur</h4>
                    <div className="flex items-center gap-2 mb-6">
                      <input 
                        type="text" 
                        placeholder="Prénom" 
                        className="border rounded-md px-3 py-2 flex-1"
                        value={resetUser}
                        onChange={(e) => setResetUser(e.target.value)}
                      />
                      <Button onClick={handleResetUser} variant="destructive">
                        Réinitialiser
                      </Button>
                    </div>
                    
                    <h4 className="font-medium mb-2">Données enregistrées</h4>
                    <div className="mb-4">
                      <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-60">
                        {exportedData || '{}'} 
                      </pre>
                    </div>
                    
                    <Button onClick={downloadData}>
                      Télécharger les données (JSON)
                    </Button>
                  </div>
                )}
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
