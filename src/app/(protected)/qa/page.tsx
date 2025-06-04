'use client'

import React from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import AskQuestionCard from '../dashboard/ask-question-card'
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from '../dashboard/code-references'
import  Image from "next/image"




export default function QAPage() {
    const { projectId } = useProject()
    const { data: questions } = api.project.getQuestions.useQuery({ projectId })

    const [questionIndex, setQuestionIndex] = React.useState(0);
    const question = questions?.[questionIndex];
    return (
        <>
            <Sheet>
                <AskQuestionCard />
                <div className='h-4'></div>
                <h1 className='text-xl font-semibold'>Saved Questions</h1>
                <div className="h-2"></div>
                <div className="flex flex-col gap-2">
                    {questions?.map((question, index) => (
                        <React.Fragment key={question.id}>
                            <SheetTrigger onClick={() => setQuestionIndex(index)}>
                                <div className="flex items-start gap-4 p-4 rounded-md bg-[#d0c8f9] hover:bg-gray-100 cursor-pointer shadow border">
                                    {question.user.imageUrl ? (
                                        <Image
                                            src={question.user.imageUrl}
                                            alt="User"
                                            width={100}
                                            height={100}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-[40px] h-[40px] rounded-full bg-black text-white flex items-center justify-center text-2xl font-semibold">
                                            {question.user.emailAddress?.split("@")[0]?.[0]?.toUpperCase() ?? "U"}
                                        </div>
                                    )}
                                    <div className="flex flex-col text-left w-full min-w-0">

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 w-full">
                                            <p className="text-gray-700 text-lg font-medium truncate">
                                                {question.question}
                                            </p>
                                            <span className="text-xs text-gray-400 sm:whitespace-nowrap">
                                                {question.createdAt.toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 break-words">
                                            {question.answer}
                                        </p>
                                    </div>
                                </div>
                            </SheetTrigger>
                        </React.Fragment>
                    ))}
                </div>

                {question && (
                    <SheetContent className="lg:max-w-[80vw] sm:max-w-full h-screen flex flex-col">
                        <SheetHeader className="h-2/5 overflow-hidden">
                            <SheetTitle>
                                {question.question}
                            </SheetTitle>
                            <MDEditor.Markdown
                                source={question.answer}
                                style={{
                                    background: 'white',
                                    color: 'black',
                                    maxHeight: '100%',
                                    overflowY: 'auto',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'gray lightgray'
                                }}
                                className="w-full h-full p-2 scroll-smooth"
                            />
                        </SheetHeader>
                        <div className="h-3/5 mx-2 overflow-auto">
                            <CodeReferences
                                filesReferences={Array.isArray(question.filesReferences) ? question.filesReferences.filter((ref): ref is { fileName: string; sourceCode: string; summary: string } =>
                                    typeof ref === 'object' &&
                                    ref !== null &&
                                    'fileName' in ref &&
                                    'sourceCode' in ref &&
                                    'summary' in ref
                                ) : []} />
                        </div>
                    </SheetContent>


                )}
            </Sheet>
        </>
    )
}
