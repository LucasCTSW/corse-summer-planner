
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Plus, Download, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { exportAllData, resetUserPreferences, saveQuestionConfiguration, getQuestionConfiguration, deleteOptionFromQuestion, addOptionToQuestion, getGlobalCustomOptions } from '@/lib/logic';
import { FormOption, StepName } from '@/lib/types';
import { userNames } from '@/lib/data';

interface QuestionConfig {
  stepName: StepName;
  title: string;
  emoji: string;
  allowMultiple: boolean;
  allowCustom: boolean;
  order: number;
  options: FormOption[];
}

const AdminManagement = () => {
  const [allData, setAllData] = useState<any>({});
  const [questions, setQuestions] = useState<QuestionConfig[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [editingQuestion, setEditingQuestion] = useState<QuestionConfig | null>(null);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');

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
    const questionsWithOrder = config.map((q: any, index: number) => ({
      ...q,
      order: q.order ?? index,
      options: q.options || []
    }));
    setQuestions(questionsWithOrder.sort((a, b) => a.order - b.order));
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

    XLSX.writeFile(workbook, 'voyage_corse_donnees.xlsx');
  };

  const handleResetUser = () => {
    if (selectedUser) {
      resetUserPreferences(selectedUser);
      setSelectedUser('');
      loadData();
    }
  };

  const moveQuestion = (questionIndex: number, direction: 'up' | 'down') => {
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < newQuestions.length) {
      [newQuestions[questionIndex], newQuestions[targetIndex]] = 
      [newQuestions[targetIndex], newQuestions[questionIndex]];
      
      // Mettre à jour les ordres
      newQuestions.forEach((q, index) => {
        q.order = index;
      });
      
      setQuestions(newQuestions);
      saveQuestionConfiguration(newQuestions);
    }
  };

  const addNewQuestion = () => {
    if (!newQuestionTitle) return;
    
    const newQuestion: QuestionConfig = {
      stepName: `custom-${Date.now()}` as StepName,
      title: newQuestionTitle,
      emoji: '❓',
      allowMultiple: true,
      allowCustom: true,
      order: questions.length,
      options: []
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    saveQuestionConfiguration(updatedQuestions);
    setNewQuestionTitle('');
  };

  const deleteQuestion = (stepName: StepName) => {
    const updatedQuestions = questions.filter(q => q.stepName !== stepName);
    setQuestions(updatedQuestions);
    saveQuestionConfiguration(updatedQuestions);
  };

  const addOptionToQuestionHandler = (questionStepName: StepName, optionLabel: string) => {
    if (!optionLabel) return;
    
    const newOption: FormOption = {
      id: `admin-${questionStepName}-${Date.now()}`,
      label: optionLabel,
      emoji: '⭐',
      addedBy: 'Admin'
    };
    
    addOptionToQuestion(questionStepName, newOption);
    loadQuestions(); // Refresh to show the new option
  };

  const deleteOptionFromQuestionHandler = (questionStepName: StepName, optionId: string) => {
    deleteOptionFromQuestion(questionStepName, optionId);
    loadQuestions(); // Refresh to remove the option
    loadData(); // Refresh user data in case their selections were affected
  };

  const getAllOptionsForQuestion = (questionStepName: StepName): FormOption[] => {
    const question = questions.find(q => q.stepName === questionStepName);
    const adminOptions = question?.options || [];
    const userCustomOptions = getGlobalCustomOptions(questionStepName);
    
    // Combine and deduplicate
    const combined = [...adminOptions, ...userCustomOptions];
    return combined.filter((option, index, self) => 
      index === self.findIndex(o => o.id === option.id)
    );
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
        <h1 className="text-3xl font-bold mb-2">🛠️ Administration - Voyage Corse 2025</h1>
        <p className="text-muted-foreground">Interface de gestion complète</p>
        <div className="mt-2">
          <Badge variant="outline">Lien privé : /admin-corsica-2025</Badge>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="responses">Réponses</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>État des réponses par utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-4">
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Choisir un utilisateur à réinitialiser" />
                  </SelectTrigger>
                  <SelectContent>
                    {userNames.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleResetUser} variant="destructive" disabled={!selectedUser}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead>Message personnalisé</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userNames.map(userName => {
                    const userData = allData[userName];
                    return (
                      <TableRow key={userName}>
                        <TableCell className="font-medium">{userName}</TableCell>
                        <TableCell>
                          <Badge variant={
                            getUserCompletionStatus(userName) === 'Terminé' ? 'default' :
                            getUserCompletionStatus(userName).includes('En cours') ? 'secondary' : 'outline'
                          }>
                            {getUserCompletionStatus(userName)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {userData?.customMessage || 'Aucun'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Titre de la nouvelle question"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                />
                <Button onClick={addNewQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={question.stepName} className="flex items-center gap-2 p-3 border rounded">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveQuestion(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveQuestion(index, 'down')}
                        disabled={index === questions.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-xl">{question.emoji}</span>
                    <div className="flex-1">
                      <Input
                        value={question.title}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].title = e.target.value;
                          setQuestions(newQuestions);
                          saveQuestionConfiguration(newQuestions);
                        }}
                      />
                    </div>
                    <Badge variant="secondary">{getAllOptionsForQuestion(question.stepName).length} réponses</Badge>
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
        </TabsContent>

        <TabsContent value="responses">
          <div className="grid gap-4">
            {questions.map((question) => (
              <Card key={question.stepName}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{question.emoji}</span>
                    <span>{question.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getAllOptionsForQuestion(question.stepName).map(option => (
                      <div key={option.id} className="flex items-center gap-2 bg-muted p-2 rounded">
                        <span>{option.emoji} {option.label}</span>
                        {option.addedBy && (
                          <span className="text-xs text-muted-foreground">({option.addedBy})</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteOptionFromQuestionHandler(question.stepName, option.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nouvelle réponse"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addOptionToQuestionHandler(question.stepName, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addOptionToQuestionHandler(question.stepName, input.value);
                        input.value = '';
                      }}
                    >
                      Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="export">
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
                Exporte toutes les données utilisateur dans un fichier Excel avec une feuille par utilisateur.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManagement;
