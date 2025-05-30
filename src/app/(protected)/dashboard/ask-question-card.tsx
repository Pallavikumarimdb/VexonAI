'use client'

import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project';
import { Sparkles, WandSparkles } from 'lucide-react';
import React from 'react'
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';
import CodeReferences from './code-references';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refetch';
import Link from 'next/link';

export default function AskQuestionCard() {
    const { project } = useProject();
    const [question, setQuestion] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filesReferences, setFilesReferences] = React.useState<{ fileName: string, sourceCode: string, summary: string }[]>([]);
    const [answer, setAnswer] = React.useState('');
    const saveAnswer = api.project.saveAnswer.useMutation();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('');
        setFilesReferences([]);
        e.preventDefault();
        if (!project?.id) return;
        setLoading(true);
    
        try {
            const { output, filesReferences } = await askQuestion(question, project.id);
            setOpen(true);
            setLoading(false);
            setFilesReferences(filesReferences);
    
            const streamAnswer = async () => {
                for await (const delta of readStreamableValue(output)) {
                    if (delta) {
                        setAnswer(ans => ans + delta);
                    }
                }
            };
            await streamAnswer();
    
        } catch (error) {
            console.error('Error asking question:', error);
            toast.error('An error occurred while processing your request.');
            setLoading(false);
        }
    };
    
    
    const refetch = useRefetch();
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogContent className='min-w-[70vw] max-w-[70vh] max-h-[98vh] py-2 flex flex-col gap-1'>
                    <DialogHeader>
                        <div className="flex item-center gap-8 mt-2">
                            <DialogTitle>
                                <Link href="/" className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-vexon-lightPurple to-vexon-purple flex items-center justify-center">
                                        <span className="text-white font-bold">V</span>
                                    </div>
                                    <span className="font-bold text-xl">Vexon AI</span>
                                </Link>
                            </DialogTitle>
                            <Button variant={'default'} disabled={saveAnswer.isPending} className='bg-vexon-purple text-white' onClick={ () => {
                                // if (!project?.id) return;                              
                                saveAnswer.mutate({
                                    projectId: project!.id,
                                    question,
                                    answer,
                                    filesReferences
                                }, {
                                    onSuccess: () => {
                                        toast.success('Answer saved successfully');
                                        refetch();
                                    },
                                    onError: () => {
                                        toast.error('Error saving answer');
                                    }
                                })
                            }}>
                                Save Answer
                            </Button>
                        </div>
                    </DialogHeader>
                    <MDEditor.Markdown
                        source={answer}
                        style={{
                            background: 'white',
                            color: 'black',
                            maxHeight: '100%',
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'gray lightgray'
                        }}
                        className="w-full h-full p-2 bg-slate-200 scroll-smooth"
                    />
                    <div className="h-4"></div>
                    <CodeReferences filesReferences={filesReferences} />
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="m-0 px-6 py-2 text-white bg-vexon-dark-purple rounded-md hover:bg-blue-600"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Card className='relative col-span-2 bg-vexon-light-purple/30'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span>Ask a Question</span>
                        <span><Sparkles /></span>
                    </CardTitle>

                </CardHeader>
                <form onSubmit={onSubmit} className='mx-4'>
                    <Textarea placeholder="Which file should I edit to change the home page?" value={question} onChange={e => setQuestion(e.target.value)} />
                    <div className='h-4'></div>
                    <div className='justify-center items-center text-center'>
                        <Button type="submit" disabled={loading}>
                            Ask VexonAI
                            <WandSparkles />
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    )
}
