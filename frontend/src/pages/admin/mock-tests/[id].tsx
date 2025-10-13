import { useState, useRef } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2, Upload, PlusCircle } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type MockQuestion = {
  id: string;
  question_text: string;
  options: Record<string, any>;
  correct_answer: string;
  marks: number | null;
};

type MockTestDetails = {
  id: string;
  title: string;
  description: string | null;
  mock_questions: MockQuestion[];
};

interface SingleTestPageProps {
  initialTest: MockTestDetails;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  try {
    const test = await api.get(`/mock-tests/${id}`);
    return { props: { initialTest: test } };
  } catch (error) {
    console.error(`Failed to fetch mock test with id ${id}:`, error);
    return { notFound: true };
  }
};

const SingleTestPage: NextPage<SingleTestPageProps> = ({ initialTest }) => {
  const { token } = useAuth();
  const router = useRouter();
  const [test, setTest] = useState<MockTestDetails>(initialTest);
  
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [editingQuestion, setEditingQuestion] = useState<Partial<MockQuestion> | null>(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('test_id', test.id);
    try {
      const response = await fetch('http://localhost:3000/mock-questions/upload/csv', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload CSV.');
      }
      alert('CSV uploaded successfully!');
      router.reload();
    } catch (err: unknown) {
      alert(`Upload failed: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
      setIsCsvDialogOpen(false);
    }
  };

  const openQuestionDialog = (question: Partial<MockQuestion> | null = null) => {
    const defaultOptions = { a: '', b: '', c: '', d: '' };
    setEditingQuestion(question 
      ? { ...question, options: { ...defaultOptions, ...question.options } } 
      : { question_text: '', options: defaultOptions, correct_answer: '', marks: 1 }
    );
    setIsQuestionDialogOpen(true);
  };
  
  const handleSaveQuestion = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingQuestion) return;
    setIsLoading(true);

    const isEditMode = !!editingQuestion.id;
    const endpoint = isEditMode ? `/mock-questions/${editingQuestion.id}` : '/mock-questions';
    const method = isEditMode ? 'put' : 'post';

    // FIX: Filter out blank options before saving
    const cleanOptions: Record<string, any> = {};
    if (editingQuestion.options) {
      Object.entries(editingQuestion.options).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          cleanOptions[key] = value;
        }
      });
    }
    
    const payload = { 
      ...editingQuestion,
      options: cleanOptions, // Use the cleaned options
      test_id: Number(test.id) 
    };

    try {
      await api[method](endpoint, payload, authToken);
      router.reload();
    } catch (err: unknown) {
      alert(`Failed to save question: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
      setIsQuestionDialogOpen(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/mock-questions/${questionId}`, authToken);
      router.reload();
    } catch (err: unknown) {
      alert(`Failed to delete question: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{test.title}</h1>
          <p className="text-muted-foreground">{test.description || 'Manage the questions for this test below.'}</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => openQuestionDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
            </Button>
            <Button variant="outline" onClick={() => setIsCsvDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload CSV
            </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Questions ({test.mock_questions.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Question Text</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Correct Answer</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {test.mock_questions.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.question_text}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><Button variant="outline" size="sm">View</Button></TooltipTrigger>
                        <TooltipContent><pre className="text-xs">{JSON.stringify(q.options, null, 2)}</pre></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{q.correct_answer}</TableCell>
                  <TableCell>{q.marks}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openQuestionDialog(q)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteQuestion(q.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCsvDialogOpen} onOpenChange={setIsCsvDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Bulk Upload Questions</DialogTitle></DialogHeader>
          <form onSubmit={handleCsvUpload} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="csv-file">CSV File</Label>
                <Input 
                    id="csv-file" 
                    type="file" 
                    accept=".csv" 
                    ref={fileInputRef}
                    onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                    required 
                />
                <p className="text-xs text-muted-foreground">
                    Must have headers: question_text, options, correct_answer. The 'options' column must be a valid JSON string.
                </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsCsvDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Uploading...' : 'Upload File'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{editingQuestion?.id ? 'Edit' : 'Create'} Question</DialogTitle></DialogHeader>
          {editingQuestion && (
            <form onSubmit={handleSaveQuestion} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
              <div className="space-y-2">
                <Label htmlFor="q-text">Question Text</Label>
                <Textarea id="q-text" value={editingQuestion.question_text || ''} onChange={(e) => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(editingQuestion.options || {}).map(key => (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={`q-opt-${key}`}>Option {key.toUpperCase()}</Label>
                        <Input id={`q-opt-${key}`} value={editingQuestion.options?.[key] || ''} onChange={(e) => setEditingQuestion({ ...editingQuestion, options: {...editingQuestion.options, [key]: e.target.value }})} />
                    </div>
                ))}
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="q-correct">Correct Answer Key</Label>
                    <Input id="q-correct" value={editingQuestion.correct_answer || ''} onChange={(e) => setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })} placeholder="e.g., 'a'" required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="q-marks">Marks</Label>
                    <Input id="q-marks" type="number" value={editingQuestion.marks || 1} onChange={(e) => setEditingQuestion({ ...editingQuestion, marks: parseInt(e.target.value) })} required/>
                </div>
              </div>
              <DialogFooter className="sticky bottom-0 bg-white pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsQuestionDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Question'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingleTestPage;