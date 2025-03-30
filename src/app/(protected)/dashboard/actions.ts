'use server'

import {streamText} from 'ai';
import {createStreamableValue} from 'ai/rsc'
import {createGoogleGenerativeAI} from '@ai-sdk/google'
import { generateEmbedding } from '@/lib/gemini';
import { prisma } from '@/server/db';
import "dotenv/config";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY ?? '', 
})


export async function askQuestion(question: string, projectId: string) {
    const stream = createStreamableValue();

    const queryVector = await generateEmbedding(question);
    const vectorQuery = `[${queryVector.join(',')}]`;

    const result: { fileName: string; sourceCode: string; summary: string }[] = await prisma.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) as similarity
    FROM "SourceCodeEmbedding"
    WHERE 1-("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10;
    `;

    let context = ''

    for(const doc of result) {
        context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`;
    }


    void (async () => { 
        const response = streamText({
            model: google('gemini-1.5-flash'),
            prompt: `
            You are an ai code assistant who answers questions about the codebase. Your target audience is a technical interns who is looking to understand the codebase.
                AI assistant is a brand new, powerful, human-like artificial intelligence assistant.
        The trait of AI include expert knowledge, helpfulness, cleaverness and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly , kind and inspiring and he/she is eager to provide vivid and thoughtful responses to user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        If the question is asking about code or a specific file, AI will provide the datailed answer, giving step by step instructions, including code snippets.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK

        START QUESTION
        ${question}
        END OF QUESTION
        AI asistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question, the AI assistant will say. "I'm sorry, but I don't have the answer to that question."
        AI assistant will not apologize for previous responses, but insead will indicated new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.
        Answer in markdown syntax with code snippets if needed. Be as detailed as possible when answering, make there is no need to repeat the context.
            `
        })

        const { textStream } = response;
        
        for await (const dalta of textStream) {
            stream.update(dalta)
        }
    })()

    return {
        output:stream.value,
        filesReferences: result
    }
}