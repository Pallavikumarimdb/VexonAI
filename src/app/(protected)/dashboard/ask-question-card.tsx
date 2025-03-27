'use client'

import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project';
import { Sparkles, Wand, WandSparkles } from 'lucide-react';
import React from 'react'
import { set } from 'date-fns';
import type { FieldName } from 'react-hook-form';
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';

export default function AskQuestionCard() {
    const { project } = useProject();
    const [question, setQuestion] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filesReferences, setFilesReferences] = React.useState<{ fileName: string, sourceCode: string, summary: string }[]>([]);
    const [answer, setAnswer] = React.useState('');

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('');
        setFilesReferences([]);
        e.preventDefault();
        if (!project?.id) return;
        setLoading(true);


        const { output, filesReferences } = await askQuestion(question, project.id);
        setOpen(true);
        setLoading(false);
        setFilesReferences(filesReferences);

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta);
            }
        }
    }
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='min-w-[60vw]  '>
                    <DialogHeader>
                        <DialogTitle>
                            <Image src="/logo.png" alt="Logo" width={40} height={40} />
                        </DialogTitle>
                    </DialogHeader>
                    <MDEditor.Markdown
                        source={answer}
                        style={{
                            background: 'white',
                            color: 'black',
                            maxHeight: '70vh',
                            overflowY: 'auto',
                            scrollbarWidth: 'thin', 
                            scrollbarColor: 'gray lightgray'
                        }}
                        className="bg-white p-4 w-full max-h-[70vh] overflow-y-auto scroll-smooth"
                    />

                    <Button type='button' onClick={() => setOpen(false)}>Close</Button>

                </DialogContent>
            </Dialog>
            <Card className='relative col-span-2  '>
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
