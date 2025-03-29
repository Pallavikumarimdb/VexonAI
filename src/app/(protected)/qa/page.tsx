'use client'

import React from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import AskQuestionCard from '../dashboard/ask-question-card'
import MDEditor from '@uiw/react-md-editor'
import { Code } from 'lucide-react'
import CodeReferences from '../dashboard/code-references'


export default function QAPage() {
    const { projectId } = useProject()
    const {data: questions} = api.project.getQuestions.useQuery({projectId})

    const [questionIndex, setQuestionIndex] = React.useState(0);
    const question = questions?.[questionIndex];
  return (
    <>
      <Sheet>
        <AskQuestionCard/>
        <div className='h-4'></div>
        <h1 className='text-xl font-semibold'>Saved Questions</h1>
        <div className="h-2"></div>
        <div className='flex flex-col gap-2'>
            {questions?.map((question, index) => {
                return <React.Fragment key={question.id}>
                    <SheetTrigger onClick={() => setQuestionIndex(index)}>
                        <div className='flex items-center gap-4 p-4 rounded-md bg-[#d0c8f9] hover:bg-gray-100 cursor-pointer shadow border'>
                            <img className='rounded-full' src={question.user.imageUrl ?? ''} height={30} width={30} />

                            <div className='text-left flex flex-col'>
                                <div className='flex items-center gap-2'>
                                    <p className='text-gray-700 line-clamp-1 text-lg font-medium'>
                                        {question.question}
                                    </p>
                                    <span className='text-xs text-gray-400 whitespace-nowrap'>
                                        {question.createdAt.toLocaleDateString()}
                                    </span>
                                </div>
                                <p className='text-sm text-gray-500 line-clamp-1'>
                                    {question.answer}
                                </p>
                            </div>
                        </div>

                    </SheetTrigger>
                </React.Fragment>

            })}
        </div>
        {question && (
         <SheetContent className="sm:max-w-[80vw] h-screen flex flex-col">
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
             <CodeReferences filesReferences={(question.filesReferences ?? []) as any} />
         </div>
     </SheetContent>
     
      
        )}
      </Sheet>
    </>
  )
}
