
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Plus, Download, RotateCcw, ChevronUp, ChevronDown, Users, BarChart3 } from 'lucide-react';
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
    const parsed = JSON.parse(data);
    console.log('Données chargées:', parsed);
    setAllData(parsed);
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
    console.log('Export Excel - données:', allData);
    const workbook = XLSX.utils.book_new();
    
    // Créer une feuille de synthèse
    const summaryData = [
      ['Utilisateur', 'Plats', 'Allergies', 'Petit-déj', 'Boissons', 'Activités', 'Budget', 'Objets', 'Statut']
    ];
    
    Object.entries(allData).forEach(([userName, userData]: [string, any]) => {
      summaryData.push([
        userName,
        userData.meals?.join('; ') || '',
        userData.allergies?.join('; ') || '',
        userData.breakfast?.join('; ') || '',
        userData.drinks?.join('; ') || '',
        userData.activities?.join('; ') || '',
        userData.budget || '',
        userData.items?.join('; ') || '',
        getUserCompletionStatus(userName)
      ]);
    });
    
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Synthèse');
    
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

    // Créer une feuille de statistiques
    const statsData = [['Question', 'Option', 'Nombre de réponses']];
    questions.forEach(question => {
      const allOptions = getAllOptionsForQuestion(question.stepName);
      allOptions.forEach(option => {
        const count = Object.values(allData).filter((userData: any) => {
          const userAnswers = userData[question.stepName];
          if (Array.isArray(userAnswers)) {
            return userAnswers.includes(option.id);
          }
          return userAnswers === option.id;
        }).length;
        
        if (count > 0) {
          statsData.push([question.title, option.label, count.toString()]);
        }
      });
    });
    
    const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Statistiques');

    XLSX.writeFile(workbook, `voyage_corse_donnees_${new Date().toISOString().split('T')[0]}.xlsx`);
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
    console.log('Nouvelle question ajoutée:', newQuestion);
  };

  const deleteQuestion = (stepName: StepName) => {
    const updatedQuestions = questions.filter(q => q.stepName !== stepName);
    updatedQuestions.forEach((q, index) => {
      q.order = index;
    });
    setQuestions(updatedQuestions);
    saveQuestionConfiguration(updatedQuestions);
    console.log('Question supprimée:', stepName);
  };

  const addOptionToQuestionHandler = (questionStepName: StepName, optionLabel: string) => {
    if (!optionLabel.trim()) return;
    
    const newOption: FormOption = {
      id: `admin-${questionStepName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: optionLabel.trim(),
      emoji: '⭐',
      addedBy: 'Admin'
    };
    
    console.log('Ajout d\'option:', newOption);
    addOptionToQuestion(questionStepName, newOption);
    loadQuestions();
    loadData();
  };

  const deleteOptionFromQuestionHandler = (questionStepName: StepName, optionId: string) => {
    console.log('Suppression d\'option:', { questionStepName, optionId });
    deleteOptionFromQuestion(questionStepName, optionId);
    loadQuestions();
    loadData();
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
    const completedFields = requiredFields.filter(field => 
      userData[field] && (Array.isArray(userData[field]) ? userData[field].length > 0 : userData[field])
    );
    
    if (completedFields.length === requiredFields.length && userData.customMessage) {
      return 'Terminé';
    } else {
      return `En cours (${completedFields.length}/${requiredFields.length})`;
    }
  };

  const getOptionStats = (questionStepName: StepName, optionId: string): number => {
    return Object.values(allData).filter((userData: any) => {
      const userAnswers = userData[questionStepName];
      if (Array.isArray(userAnswers)) {
        return userAnswers.includes(optionId);
      }
      return userAnswers === optionId;
    }).length;
  };

  const getTotalResponses = () => {
    return Object.keys(allData).length;
  };

  const getCompletedResponses = () => {
    return Object.keys(allData).filter(userName => 
      getUserCompletionStatus(userName) === 'Terminé'
    ).length;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🛠️ Administration - Voyage Corse 2025</h1>
        <p className="text-muted-foreground">Interface de gestion complète</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center p-4">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Total réponses</p>
                <p className="text-2xl font-bold">{getTotalResponses()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Terminées</p>
                <p className="text-2xl font-bold">{getCompletedResponses()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-orange-600 font-bold">%</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux completion</p>
                <p className="text-2xl font-bold">
                  {getTotalResponses() > 0 ? Math.round((getCompletedResponses() / getTotalResponses()) * 100) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-2">
          <Badge variant="outline">Lien privé : /admin-corsica-2025</Badge>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="responses">Réponses détaillées</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
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

        <TabsContent value="responses">
          <div className="space-y-4">
            {Object.entries(allData).map(([userName, userData]: [string, any]) => (
              <Card key={userName}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{userName}</span>
                    <Badge variant={
                      getUserCompletionStatus(userName) === 'Terminé' ? 'default' :
                      getUserCompletionStatus(userName).includes('En cours') ? 'secondary' : 'outline'
                    }>
                      {getUserCompletionStatus(userName)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Plats:</strong> {userData.meals?.join(', ') || 'Aucun'}
                    </div>
                    <div>
                      <strong>Allergies:</strong> {userData.allergies?.join(', ') || 'Aucune'}
                    </div>
                    <div>
                      <strong>Petit-déjeuner:</strong> {userData.breakfast?.join(', ') || 'Aucun'}
                    </div>
                    <div>
                      <strong>Boissons:</strong> {userData.drinks?.join(', ') || 'Aucune'}
                    </div>
                    <div>
                      <strong>Activités:</strong> {userData.activities?.join(', ') || 'Aucune'}
                    </div>
                    <div>
                      <strong>Budget:</strong> {userData.budget || 'Non défini'}
                    </div>
                    <div>
                      <strong>Objets:</strong> {userData.items?.join(', ') || 'Aucun'}
                    </div>
                    <div>
                      <strong>Message:</strong> {userData.customMessage || 'Aucun'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats">
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
                  <div className="space-y-2">
                    {getAllOptionsForQuestion(question.stepName).map(option => {
                      const count = getOptionStats(question.stepName, option.id);
                      const percentage = getTotalResponses() > 0 ? Math.round((count / getTotalResponses()) * 100) : 0;
                      
                      return (
                        <div key={option.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="flex items-center gap-2">
                            <span>{option.emoji}</span>
                            <span>{option.label}</span>
                            {option.addedBy && (
                              <Badge variant="outline" className="text-xs">
                                {option.addedBy}
                              </Badge>
                            )}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {count} ({percentage}%)
                            </span>
                            <div className="w-16 h-2 bg-gray-200 rounded">
                              <div 
                                className="h-full bg-blue-500 rounded" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addNewQuestion();
                    }
                  }}
                />
                <Button onClick={addNewQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={question.stepName} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
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
                      <Badge variant="secondary">{getAllOptionsForQuestion(question.stepName).length} options</Badge>
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

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
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
                          placeholder="Nouvelle option"
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
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={exportToExcel} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exporter en Excel (avec statistiques)
              </Button>
              <p className="text-sm text-muted-foreground">
                Exporte toutes les données utilisateur dans un fichier Excel avec :
              </p>
              <ul className="text-sm text-muted-foreground list-disc ml-6">
                <li>Une synthèse de toutes les réponses</li>
                <li>Une feuille par utilisateur avec ses réponses détaillées</li>
                <li>Une feuille de statistiques avec le nombre de réponses par option</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManagement;
