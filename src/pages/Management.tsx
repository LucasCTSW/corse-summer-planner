
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Plus, Download, RotateCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { exportAllData, resetUserPreferences, saveQuestionConfiguration, getQuestionConfiguration } from '@/lib/logic';
import { FormOption, StepName } from '@/lib/types';

interface QuestionConfig {
  stepName: StepName;
  title: string;
  emoji: string;
  allowMultiple: boolean;
  allowCustom: boolean;
  options: FormOption[];
}

const Management = () => {
  const [allData, setAllData] = useState<any>({});
  const [questions, setQuestions] = useState<QuestionConfig[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuestionConfig | null>(null);
  const [newQuestionName, setNewQuestionName] = useState('');
  const [resetUser, setResetUser] = useState('');

  useEffect(() => {
    loadData();
    loadQuestions();
  }, []);

  const loadData = () => {
    const data = exportAllData();
    setAllData(JSON.parse(data));
  };

  const loadQuestions = () => {
    const config = getQuestionConfiguration();
    setQuestions(config);
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Créer une feuille par utilisateur
    Object.entries(allData).forEach(([userName, userData]: [string, any]) => {
      const worksheetData = [
        ['Question', 'Réponse'],
        ['Plats préférés', userData.meals?.join(', ') || ''],
        ['Allergies', userData.allergies?.join(', ') || ''],
        ['Petit-déjeuner', userData.breakfast?.join(', ') || ''],
        ['Boissons', userData.drinks?.join(', ') || ''],
        ['Activités', userData.activities?.join(', ') || ''],
        ['Budget', userData.budget || ''],
        ['Objets à prévoir', userData.items?.join(', ') || ''],
        ['Message personnalisé', userData.customMessage || '']
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, userName);
    });

    // Créer une feuille de résumé
    const summaryData = [
      ['Utilisateur', 'Plats', 'Allergies', 'Petit-déjeuner', 'Boissons', 'Activités', 'Budget', 'Objets'],
      ...Object.entries(allData).map(([userName, userData]: [string, any]) => [
        userName,
        userData.meals?.join(', ') || '',
        userData.allergies?.join(', ') || '',
        userData.breakfast?.join(', ') || '',
        userData.drinks?.join(', ') || '',
        userData.activities?.join(', ') || '',
        userData.budget || '',
        userData.items?.join(', ') || ''
      ])
    ];
    
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Résumé');

    XLSX.writeFile(workbook, 'voyage_corse_donnees.xlsx');
  };

  const handleResetUser = () => {
    if (resetUser) {
      resetUserPreferences(resetUser);
      setResetUser('');
      loadData();
    }
  };

  const updateQuestionTitle = (stepName: StepName, newTitle: string) => {
    const updatedQuestions = questions.map(q => 
      q.stepName === stepName ? { ...q, title: newTitle } : q
    );
    setQuestions(updatedQuestions);
    saveQuestionConfiguration(updatedQuestions);
  };

  const addNewQuestion = () => {
    if (!newQuestionName) return;
    
    const newQuestion: QuestionConfig = {
      stepName: `custom-${Date.now()}` as StepName,
      title: newQuestionName,
      emoji: '❓',
      allowMultiple: true,
      allowCustom: true,
      options: []
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    saveQuestionConfiguration(updatedQuestions);
    setNewQuestionName('');
  };

  const deleteQuestion = (stepName: StepName) => {
    const updatedQuestions = questions.filter(q => q.stepName !== stepName);
    setQuestions(updatedQuestions);
    saveQuestionConfiguration(updatedQuestions);
  };

  const getUserCompletionStatus = (userName: string) => {
    const userData = allData[userName];
    if (!userData) return 'Non commencé';
    
    const hasBasicData = userData.meals || userData.drinks || userData.activities || userData.budget;
    if (!hasBasicData) return 'Non commencé';
    
    const requiredFields = ['meals', 'drinks', 'activities', 'budget'];
    const completedFields = requiredFields.filter(field => userData[field] && userData[field].length > 0);
    
    if (completedFields.length === requiredFields.length && userData.customMessage) {
      return 'Terminé';
    } else {
      return `En cours (${completedFields.length}/${requiredFields.length})`;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gestion du voyage en Corse</h1>
        <p className="text-muted-foreground">Interface de gestion pour organiser le voyage</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="export">Export & Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>État des réponses par utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead>Plats préférés</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(allData).map(([userName, userData]: [string, any]) => (
                    <TableRow key={userName}>
                      <TableCell className="font-medium">{userName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          getUserCompletionStatus(userName) === 'Terminé' 
                            ? 'bg-green-100 text-green-800' 
                            : getUserCompletionStatus(userName) === 'En cours' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getUserCompletionStatus(userName)}
                        </span>
                      </TableCell>
                      <TableCell>{userData.meals?.slice(0, 2).join(', ') || 'Aucun'}</TableCell>
                      <TableCell>{userData.budget || 'Non défini'}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            resetUserPreferences(userName);
                            loadData();
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom de la nouvelle question"
                    value={newQuestionName}
                    onChange={(e) => setNewQuestionName(e.target.value)}
                  />
                  <Button onClick={addNewQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>

                <div className="space-y-2">
                  {questions.map((question) => (
                    <div key={question.stepName} className="flex items-center gap-2 p-3 border rounded">
                      <span className="text-xl">{question.emoji}</span>
                      <Input
                        value={question.title}
                        onChange={(e) => updateQuestionTitle(question.stepName, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingQuestion(question)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {!['meals', 'allergies', 'breakfast', 'drinks', 'activities', 'budget', 'items'].includes(question.stepName) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuestion(question.stepName)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={exportToExcel} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter en Excel
                </Button>
                <p className="text-sm text-muted-foreground">
                  Exporte toutes les données utilisateur dans un fichier Excel avec une feuille par utilisateur et un résumé.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Réinitialiser un utilisateur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom de l'utilisateur"
                    value={resetUser}
                    onChange={(e) => setResetUser(e.target.value)}
                  />
                  <Button onClick={handleResetUser} variant="destructive">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Supprime toutes les réponses d'un utilisateur spécifique.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Management;
