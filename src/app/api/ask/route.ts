import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: Request) {
  try {
    const { question, chapterTitle } = await request.json()

    if (!question || !chapterTitle) {
      return NextResponse.json(
        { error: 'Missing question or chapter title' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in environment variables.' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `You are a helpful tutor for a chapter called "${chapterTitle}". Answer the following student question clearly and concisely in 2-4 paragraphs. Use plain text only, no markdown symbols.\n\nQuestion: ${question}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('Empty response from Gemini API')
    }

    return NextResponse.json({ answer: text })
  } catch (error: any) {
    console.error('Ask API Error details:', error);
    
    // Extract the exact error message from the Google API or fetch
    const errorDetails = error?.message || error?.toString() || 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `API Error: ${errorDetails}. Please try generating a new key.` },
      { status: 500 }
    )
  }
}
