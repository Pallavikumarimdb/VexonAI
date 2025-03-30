'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { lucario } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

type Props = {
    filesReferences: { fileName: string, sourceCode: string, summary: string }[]
}

const CodeReferences = ({ filesReferences }: Props) => {
    const [tab, setTab] = React.useState(filesReferences[0]?.fileName);
    if (filesReferences.length === 0) return <div>No files found</div>
    return (
        <div className="">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
                <div className="overflow-x-auto flex gap-1 bg-gray-600 p-1 rounded-md scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
                    {filesReferences.map((file) => (
                        <button
                            onClick={() => setTab(file.fileName)}
                            key={file.fileName}
                            className={cn(
                                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-slate-800',
                                {
                                    'bg-primary text-primary-foreground': tab === file.fileName,
                                }
                            )}
                        >
                            {file.fileName}
                        </button>
                    ))}
                </div>

                <div className="h-[40vh] overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
                    {filesReferences.map((file, index) => (
                        <TabsContent
                            key={file.fileName}
                            value={file.fileName}
                            className="max-w-6xl rounded-md"
                        >
                            <SyntaxHighlighter
                                key={index}
                                language="typescript"
                                style={lucario}
                                className="rounded-md p-2"
                            >
                                {file.sourceCode}
                            </SyntaxHighlighter>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>

        </div>
    )
}

export default CodeReferences